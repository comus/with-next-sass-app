import React, { FC, useState, useEffect } from 'react'
import { Invoice, ProductLine } from '../data/types'
import { initialInvoice, initialProductLine } from '../data/initialData'
import EditableInput from './EditableInput'
import EditableSelect from './EditableSelect'
import EditableTextarea from './EditableTextarea'
import EditableCalendarInput from './EditableCalendarInput'
import EditableFileImage from './EditableFileImage'
import countryList from '../data/countryList'
import Document from './Document'
import Page from './Page'
import View from './View'
import Text from './Text'
import { Font } from '@react-pdf/renderer'
import Download from './DownloadPDF'
import format from 'date-fns/format'

const projectList = [
  { value: '請選擇', text: '請選擇' },
  { value: '婚體', text: '婚體' },
  { value: '滿月酒', text: '滿月酒' },
  { value: '生日派對', text: '生日派對' },
  { value: '商務回禮', text: '商務回禮' },
  { value: '其他', text: '其他' },
]

const headingList = [
  { value: '發票', text: '發票' },
  { value: '收據', text: '收據' },
  { value: '報價單', text: '報價單' },
]

Font.register({
  family: 'Nunito',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/nunito/v12/XRXV3I6Li01BKofINeaE.ttf' },
    { src: 'https://fonts.gstatic.com/s/nunito/v12/XRXW3I6Li01BKofA6sKUYevN.ttf', fontWeight: 600 },
  ],
})

Font.register({
  family: 'Noto Sans TC',
  fonts: [
    { src: 'https://fonts.gstatic.com/ea/notosanstc/v1/NotoSansTC-Regular.woff2' },
    { src: 'https://fonts.gstatic.com/ea/notosanstc/v1/NotoSansTC-Bold.woff2', fontWeight: 600 },
    // { src: 'https://fonts.gstatic.com/ea/notosanssc/v1/NotoSansSC-Regular.woff2' },
  ],
})

Font.register({
  family: 'Noto Sans SC',
  fonts: [
    // { src: 'https://fonts.gstatic.com/ea/notosanstc/v1/NotoSansTC-Regular.woff2' },
    { src: 'https://fonts.gstatic.com/ea/notosanssc/v1/NotoSansSC-Regular.woff2' },
  ],
})

Font.registerHyphenationCallback((word: string) => {
  if (word.length === 1) {
    return [word];
  }   

  return Array.from(word)
    .map((char) => [char, ''])
    .reduce((arr, current) => {
      arr.push(...current);
      return arr;
    }, []);
});

interface Props {
  data?: Invoice
  pdfMode?: boolean
  onChange?: (invoice: Invoice) => void
}

let defaultInvoiceNumber = "G" + format(new Date(), "yyyyMMddHHmmss")

const InvoicePage: FC<Props> = ({ data, pdfMode, onChange }) => {
  const [invoice, setInvoice] = useState<Invoice>(data ? { ...data } : { ...initialInvoice })
  const [subTotal, setSubTotal] = useState<number>()
  const [saleTax, setSaleTax] = useState<number>()

  useEffect(() => {
    if (!pdfMode) {
      handleChange('invoiceNumber', defaultInvoiceNumber)
    }
  }, [])

  const dateFormat = 'MMM dd, yyyy'
  const invoiceDate = invoice.invoiceDate !== '' ? new Date(invoice.invoiceDate) : new Date()
  const invoiceDueDate =
    invoice.invoiceDueDate !== ''
      ? new Date(invoice.invoiceDueDate)
      : new Date(invoiceDate.valueOf())

  if (invoice.invoiceDueDate === '') {
    invoiceDueDate.setDate(invoiceDueDate.getDate() + 30)
  }

  const handleChange = (name: keyof Invoice, value: string | number) => {
    if (name !== 'productLines') {
      const newInvoice = { ...invoice }

      if (name === 'logoWidth' && typeof value === 'number') {
        newInvoice[name] = value
      } else if (name !== 'logoWidth' && typeof value === 'string') {
        newInvoice[name] = value
      }

      setInvoice(newInvoice)
    }
  }

  const handleProductLineChange = (index: number, name: keyof ProductLine, value: string) => {
    const productLines = invoice.productLines.map((productLine, i) => {
      if (i === index) {
        const newProductLine = { ...productLine }

        if (name === 'description') {
          newProductLine[name] = value
        } else {
          if (
            value[value.length - 1] === '.' ||
            (value[value.length - 1] === '0' && value.includes('.'))
          ) {
            newProductLine[name] = value
          } else {
            const n = parseFloat(value)

            newProductLine[name] = (n ? n : 0).toString()
          }
        }

        return newProductLine
      }

      return { ...productLine }
    })

    setInvoice({ ...invoice, productLines })
  }

  const handleRemove = (i: number) => {
    const productLines = invoice.productLines.filter((productLine, index) => index !== i)

    setInvoice({ ...invoice, productLines })
  }

  const handleAdd = () => {
    const productLines = [...invoice.productLines, { ...initialProductLine }]

    setInvoice({ ...invoice, productLines })
  }

  const calculateAmount = (quantity: string, rate: string) => {
    const quantityNumber = parseFloat(quantity)
    const rateNumber = parseFloat(rate)
    const amount = quantityNumber && rateNumber ? quantityNumber * rateNumber : 0

    return amount.toFixed(2)
  }

  useEffect(() => {
    let subTotal = 0

    invoice.productLines.forEach((productLine) => {
      const quantityNumber = parseFloat(productLine.quantity)
      const rateNumber = parseFloat(productLine.rate)
      const amount = quantityNumber && rateNumber ? quantityNumber * rateNumber : 0

      subTotal += amount
    })

    setSubTotal(subTotal)
  }, [invoice.productLines])

  useEffect(() => {
    const match = invoice.discountLabel?.match(/(\d+)%/)
    const taxRate = match ? parseFloat(match[1]) : 0
    const saleTax = subTotal ? (subTotal * taxRate) / 100 : 0

    setSaleTax(saleTax)
  }, [subTotal, invoice.discountLabel])

  useEffect(() => {
    if (onChange) {
      onChange(invoice)
    }
  }, [onChange, invoice])

  // console.log("invoice.productLines", invoice.productLines)

  return (
    <Document pdfMode={pdfMode}>
      <Page className="invoice-wrapper" pdfMode={pdfMode}>
        {!pdfMode && <Download data={invoice} />}

        <View className="heading" pdfMode={pdfMode}>
          <EditableSelect
            options={headingList}
            value={invoice.heading || "發票"}
            onChange={(value) => handleChange('heading', value)}
            pdfMode={pdfMode}
            className="fs-45 center red"
          />
        </View>

        <View className="flex" pdfMode={pdfMode}>
          <View className="w-55" pdfMode={pdfMode}>
            <EditableFileImage
              className="logo"
              placeholder="Your Logo"
              value={invoice.logo}
              width={invoice.logoWidth}
              pdfMode={pdfMode}
              onChangeImage={(value) => handleChange('logo', value)}
              onChangeWidth={(value) => handleChange('logoWidth', value)}
            />
            <EditableInput
              readOnly
              className="bold"
              value={"禮意店有限公司"}
              onChange={(value) => handleChange('companyName', value)}
              pdfMode={pdfMode}
            />
            <EditableInput
              readOnly
              value={"(+853)68852522"}
              pdfMode={pdfMode}
            />
            <EditableInput
              readOnly
              value={"澳門羅神父街35-49號時代工業大廈3樓1室"}
              pdfMode={pdfMode}
            />
            <EditableInput
              readOnly
              value={"giftery.mo@gmail.com"}
              pdfMode={pdfMode}
            />
          </View>
          <View className="w-45 pl-4" pdfMode={pdfMode}>
            <View className="flex mb-5 mt-100" pdfMode={pdfMode}>
              <View className="w-40" pdfMode={pdfMode}>
                <EditableInput
                  className="bold"
                  readOnly
                  value={"日期"}
                  pdfMode={pdfMode}
                />
              </View>
              <View className="w-60" pdfMode={pdfMode}>
                <EditableCalendarInput
                  value={format(invoiceDate, dateFormat)}
                  selected={invoiceDate}
                  onChange={(date) =>
                    handleChange(
                      'invoiceDate',
                      date && !Array.isArray(date) ? format(date, dateFormat) : ''
                    )
                  }
                  pdfMode={pdfMode}
                />
              </View>
            </View>

            <View className="flex mb-5" pdfMode={pdfMode}>
              <View className="w-40" pdfMode={pdfMode}>
                <EditableInput
                  readOnly
                  className="bold"
                  value={(invoice.heading || "發票") + "號碼"}
                  pdfMode={pdfMode}
                />
              </View>
              <View className="w-60" pdfMode={pdfMode}>
                <EditableInput
                  value={invoice.invoiceNumber}
                  onChange={(value) => handleChange('invoiceNumber', value)}
                  pdfMode={pdfMode}
                />
              </View>
            </View>
          </View>
        </View>

        <View className="flex mt-20" pdfMode={pdfMode}>
          <View className="w-55" pdfMode={pdfMode}>
            <EditableInput
              readOnly
              className="bold dark mb-5"
              value={"報價給予"}
              pdfMode={pdfMode}
            />
            <EditableInput
              prefix="聯絡人: "
              placeholder="輸入聯絡人姓名"
              value={invoice.clientName}
              onChange={(value) => handleChange('clientName', value)}
              pdfMode={pdfMode}
            />
            <EditableInput
              prefix="電話: "
              placeholder="輸入電話"
              value={invoice.clientPhone}
              onChange={(value) => handleChange('clientPhone', value)}
              pdfMode={pdfMode}
            />
            <EditableInput
              prefix="電郵: "
              placeholder="輸入電郵"
              value={invoice.clientMail}
              onChange={(value) => handleChange('clientMail', value)}
              pdfMode={pdfMode}
            />
            <EditableSelect
              prefix="項目: "
              options={projectList}
              value={invoice.clientProject || "請選擇"}
              onChange={(value) => handleChange('clientProject', value)}
              pdfMode={pdfMode}
              otherValue={invoice.otherProject}
              otherOnChange={(value) => handleChange('otherProject', value)}
            />
            <EditableInput
              prefix="場地聯絡人: "
              placeholder="輸入場地聯絡人"
              value={invoice.clientContactName}
              onChange={(value) => handleChange('clientContactName', value)}
              pdfMode={pdfMode}
            />
            <EditableInput
              prefix="場地聯絡人電話: "
              placeholder="輸入場地聯絡人電話"
              value={invoice.clientContactPhone}
              onChange={(value) => handleChange('clientContactPhone', value)}
              pdfMode={pdfMode}
            />
            <EditableInput
              prefix="送貨地點: "
              placeholder="輸入送貨地點"
              value={invoice.clientAddress}
              onChange={(value) => handleChange('clientAddress', value)}
              pdfMode={pdfMode}
            />
            <EditableInput
              prefix="備註: "
              placeholder="輸入備註"
              value={invoice.clientRemarks}
              onChange={(value) => handleChange('clientRemarks', value)}
              pdfMode={pdfMode}
            />
          </View>
          <View className="w-45 pl-4" pdfMode={pdfMode}>
            <View className="flex mb-5" pdfMode={pdfMode}>
              <View className="w-40" pdfMode={pdfMode}>
                <EditableInput
                  readOnly
                  className="bold"
                  value={"交貨日期"}
                  pdfMode={pdfMode}
                />
              </View>
              <View className="w-60" pdfMode={pdfMode}>
                <EditableCalendarInput
                  value={format(invoiceDueDate, dateFormat)}
                  selected={invoiceDueDate}
                  onChange={(date) =>
                    handleChange(
                      'invoiceDueDate',
                      date && !Array.isArray(date) ? format(date, dateFormat) : ''
                    )
                  }
                  pdfMode={pdfMode}
                />
              </View>
            </View>

            <View className="flex mb-5" pdfMode={pdfMode}>
              <View className="w-40" pdfMode={pdfMode}>
                <EditableInput
                  readOnly
                  className="bold"
                  value={"報價由"}
                  pdfMode={pdfMode}
                />
              </View>
              <View className="w-60" pdfMode={pdfMode}>
                <EditableInput
                  placeholder='請輸入報價人'
                  value={invoice.invoiceFrom}
                  onChange={(value) => handleChange('invoiceFrom', value)}
                  pdfMode={pdfMode}
                  list="invoiceFromList"
                  options={[
                    { value: "阮小姐", text: "阮小姐" },
                    { value: "盧先生", text: "盧先生" }
                  ]}
                />
              </View>
            </View>
          </View>
        </View>

        <View className="mt-30 bg-dark flex" pdfMode={pdfMode}>
          <View className="w-48 p-4-8" pdfMode={pdfMode}>
            <EditableInput
              className="white bold"
              value={invoice.productLineDescription}
              onChange={(value) => handleChange('productLineDescription', value)}
              pdfMode={pdfMode}
            />
          </View>
          <View className="w-17 p-4-8" pdfMode={pdfMode}>
            <EditableInput
              className="white bold right"
              value={invoice.productLineQuantity}
              onChange={(value) => handleChange('productLineQuantity', value)}
              pdfMode={pdfMode}
            />
          </View>
          <View className="w-17 p-4-8" pdfMode={pdfMode}>
            <EditableInput
              className="white bold right"
              value={invoice.productLineQuantityRate}
              onChange={(value) => handleChange('productLineQuantityRate', value)}
              pdfMode={pdfMode}
            />
          </View>
          <View className="w-18 p-4-8" pdfMode={pdfMode}>
            <EditableInput
              className="white bold right"
              value={invoice.productLineQuantityAmount}
              onChange={(value) => handleChange('productLineQuantityAmount', value)}
              pdfMode={pdfMode}
            />
          </View>
        </View>

        {invoice.productLines.map((productLine, i) => {
          return pdfMode && productLine.description === '' ? (
            null
          ) : (
            <View key={i} className="row flex" pdfMode={pdfMode}>
              <View className="w-48 p-4-8 pb-10" pdfMode={pdfMode}>
                <EditableTextarea
                  className="dark"
                  rows={2}
                  placeholder="Enter item name/description"
                  value={productLine.description}
                  onChange={(value) => handleProductLineChange(i, 'description', value)}
                  pdfMode={pdfMode}
                />
              </View>
              <View className="w-17 p-4-8 pb-10" pdfMode={pdfMode}>
                <EditableInput
                  className="dark right"
                  value={productLine.quantity}
                  onChange={(value) => handleProductLineChange(i, 'quantity', value)}
                  pdfMode={pdfMode}
                />
              </View>
              <View className="w-17 p-4-8 pb-10" pdfMode={pdfMode}>
                <EditableInput
                  className="dark right"
                  value={productLine.rate}
                  onChange={(value) => handleProductLineChange(i, 'rate', value)}
                  pdfMode={pdfMode}
                />
              </View>
              <View className="w-18 p-4-8 pb-10" pdfMode={pdfMode}>
                <EditableInput
                  readOnly
                  className="dark right"
                  value={calculateAmount(productLine.quantity, productLine.rate)}
                  pdfMode={pdfMode}
                />
              </View>
              {!pdfMode && (
                <button
                  className="link row__remove"
                  aria-label="Remove Row"
                  title="Remove Row"
                  onClick={() => handleRemove(i)}
                >
                  <span className="icon icon-remove bg-red"></span>
                </button>
              )}
            </View>
          )
        })}

        <View className="flex" pdfMode={pdfMode}>
          <View className="w-50 mt-10" pdfMode={pdfMode}>
            {!pdfMode && (
              <button className="link" onClick={handleAdd}>
                <span className="icon icon-add bg-green mr-10"></span>
                Add Line Item
              </button>
            )}
          </View>
          <View className="w-50 mt-20" pdfMode={pdfMode}>
            {(!!saleTax || !pdfMode) && (
              <>
                <View className="flex alignItemsCenter" pdfMode={pdfMode}>
                  <View className="w-50 p-5" pdfMode={pdfMode}>
                    <EditableInput
                      value={invoice.subTotalLabel}
                      onChange={(value) => handleChange('subTotalLabel', value)}
                      pdfMode={pdfMode}
                    />
                  </View>
                  <View className="w-50 p-5" pdfMode={pdfMode}>
                    <Text className="right bold dark" pdfMode={pdfMode}>
                      {subTotal?.toFixed(2)}
                    </Text>
                  </View>
                </View>
                <View className="flex alignItemsCenter" pdfMode={pdfMode}>
                  <View className="w-50 p-5" pdfMode={pdfMode}>
                    <EditableInput
                      value={invoice.discountLabel || 'Discount (0%)'}
                      onChange={(value) => handleChange('discountLabel', value)}
                      pdfMode={pdfMode}
                    />
                  </View>
                  <View className="w-50 p-5" pdfMode={pdfMode}>
                    <Text className="right bold dark" pdfMode={pdfMode}>
                      {saleTax?.toFixed(2)}
                    </Text>
                  </View>
                </View>
              </>
            )}
            
            <View className="flex bg-gray p-5 alignItemsCenter" pdfMode={pdfMode}>
              <View className="w-50 p-5" pdfMode={pdfMode}>
                <EditableInput
                  className="bold"
                  value={invoice.totalLabel}
                  onChange={(value) => handleChange('totalLabel', value)}
                  pdfMode={pdfMode}
                />
              </View>
              <View className="w-50 p-5 flex alignItemsCenter" pdfMode={pdfMode}>
                <EditableInput
                  className="dark bold right ml-30"
                  value={invoice.currency}
                  onChange={(value) => handleChange('currency', value)}
                  pdfMode={pdfMode}
                />
                <Text className="right bold dark w-auto" pdfMode={pdfMode}>
                  {(typeof subTotal !== 'undefined' && typeof saleTax !== 'undefined'
                    ? subTotal - saleTax
                    : 0
                  ).toFixed(2)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* <View className="mt-20" pdfMode={pdfMode}>
          <EditableInput
            className="bold w-100"
            value={invoice.notesLabel}
            onChange={(value) => handleChange('notesLabel', value)}
            pdfMode={pdfMode}
          />
          <EditableTextarea
            className="w-100"
            rows={2}
            value={invoice.notes}
            onChange={(value) => handleChange('notes', value)}
            pdfMode={pdfMode}
          />
        </View> */}
        <View className="mt-20" pdfMode={pdfMode}>
          <EditableInput
            readOnly
            className="bold w-100"
            value={"Terms & Conditions"}
            pdfMode={pdfMode}
          />
          <EditableTextarea
            readOnly
            className="w-100 fs-10"
            rows={2}
            value={`*所有價格均以澳門元(MOP)結算
*訂單以完成定金付款後即生效，定金需支付半數或總額之三分二
*延期或需提早交貨必須得到雙方協商同意
*訂單生效後無法取消，亦不退還定金
*如商品已製作中便無法作出更換
*客製化商品未必與圖片完全相同，所有圖片僅供參考
*凡宴會/商務禮品請客戶自行把握好訂購數量，避免過少或過多，本店概不負責
*如商品破損證實為店家不慎導致，請於收貨後48小時內聯絡店家，超過時間恕不受理
*客戶請將要更換的商品保持完整送回本店，如有使用過的痕跡或異味恕不退換
*所有商品本店會提前給予客戶確認，客戶收貨後不能因顏色、觀感、個人喜好、材質等原因而要求更換/退貨
*某些商品為手工製作，輕微睱疵實屬正常，客戶下單前自行酌量或與客服溝通
*禮意店有限公司保留最終解釋權`}
            pdfMode={pdfMode}
          />
        </View>
      </Page>
    </Document>
  )
}

export default InvoicePage
