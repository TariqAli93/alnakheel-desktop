<template>
  <div id="printable" class="page-container bg-white" dir="rtl">
    <div class="page-content">
      <div class="window-border"></div>
      <div class="besmallah text-center font-medium mb-2 flex items-center justify-center relative">
        <p class="font-black text-xl mx-auto">بِسْمِ اللَّهِ الرَّحْمَـٰنِ الرَّحِيـْمِ</p>

        <v-btn
          class="absolute top-0 left-0 bottom-0 my-auto hide-in-print"
          variant="text"
          @click="print"
          >طباعة</v-btn
        >
      </div>

      <v-divider class="my-2" />

      <div class="header flex justify-between items-center mb-2">
        <div class="right text-right">
          <h1 class="text-right font-black text-2xl">النخيل للوساطة العقارية</h1>
          <p class="text-right font-bold text-lg">لبيع و شراء الدور و الاراضي السكنية و الزراعية</p>
          <p class="text-right font-bold text-lg">مقاولات عامة</p>
        </div>
        <div class="left">
          <div class="logo">
            <img src="../assets/al_nakheel_logo-removebg-preview.png" alt="مكتب النخيل" />
          </div>
        </div>
      </div>

      <div class="slogan my-2">
        <p class="text-center font-bold text-lg">(مقاولة بيع و شراء العقارات)</p>
        <span class="mr-3 text-left block text-sm" dir="ltr">№: {{ contract?.number }}</span>
      </div>

      <div
        dir="ltr"
        class="under-header border-1 border-black pa-2 flex items-center justify-between bg-gray-300"
        style="margin-block: 5px"
      >
        <p class="text-sm"><span class="font-bold">0782 325 2205 - 0771 405 4446</span></p>
        <p class="text-right font-bold text-sm">
          بغداد / الدورة / حي دجلة / شارع الضغط / يحيى السلامي
        </p>
      </div>

      <div class="content my-2">
        <div class="flex items-start justify-between gap-2 pa-1">
          <div class="seller w-full flex flex-col gap-1">
            <p class="font-bold text-sm">الطرف الاول / البائع:</p>
            <div class="info-box">
              <span class="ml-3">الاسم : </span><span>{{ contract?.seller?.name }}</span>
            </div>
            <div class="info-box">
              <span class="ml-3">العنوان : </span><span>{{ contract?.seller?.address }}</span>
            </div>
            <div class="info-box">
              <span class="ml-3">رقم الهوية : </span><span>{{ contract?.seller?.id }}</span>
            </div>
            <div class="info-box">
              <span class="ml-3">الهاتف : </span><span>{{ contract?.seller?.phone }}</span>
            </div>
          </div>
          <div class="buyer w-full flex flex-col gap-1">
            <p class="font-bold text-sm">الطرف الثاني / المشتري:</p>
            <div class="info-box">
              <span class="ml-3">الاسم : </span><span>{{ contract?.buyer?.name }}</span>
            </div>
            <div class="info-box">
              <span class="ml-3">العنوان : </span><span>{{ contract?.buyer?.address }}</span>
            </div>
            <div class="info-box">
              <span class="ml-3">رقم الهوية : </span><span>{{ contract?.buyer?.id }}</span>
            </div>
            <div class="info-box">
              <span class="ml-3">الهاتف : </span><span>{{ contract?.buyer?.phone }}</span>
            </div>
          </div>
        </div>

        <div class="font-bold my-2 px-2">
          لقد تم الاتفاق بين الطرفين على عقد هذه المقاولة وبالشروط التالية:
        </div>

        <div class="conditions pa-2">
          <div class="font-medium">
            اولا / يعترف الطرف الاول بانه قد باع للطرف الثاني الملك المفصل فيما يلي :
          </div>

          <div class="grid grid-cols-3 gap-1 mt-1">
            <div class="info-box">
              <span class="ml-3">نوع الملك : </span><span>{{ contract?.property?.type }}</span>
            </div>
            <div class="info-box">
              <span class="ml-3">رقم المقاطعة : </span
              ><span>{{ contract?.property?.district }}</span>
            </div>
            <div class="info-box">
              <span class="ml-3">المحلة : </span><span>{{ contract?.property?.mahalla }}</span>
            </div>
          </div>

          <div class="grid grid-cols-4 gap-1 mt-1">
            <div class="info-box">
              <span class="ml-3">رقم القطعة : </span
              ><span>{{ contract?.property?.landnumber }}</span>
            </div>
            <div class="info-box">
              <span class="ml-3">المساحة : </span><span>{{ contract?.property?.area }}</span>
            </div>
            <div class="info-box">
              <span class="ml-3">الواجهة : </span><span>{{ contract?.property?.face }}</span>
            </div>
            <div class="info-box">
              <span class="ml-3">النزال : </span><span>{{ contract?.property?.depth }}</span>
            </div>
          </div>

          <div class="font-medium mt-2">ثانيا / إن بدل البيع المتفق عليه هو :</div>
          <div class="grid grid-cols-3 gap-1 mt-1">
            <div class="info-box">
              <span class="ml-3">المبلغ : </span><span>{{ contract?.price?.priceNumber }}</span>
            </div>
            <div class="info-box">
              <span class="ml-3">المبلغ كتابة : </span
              ><span>{{ contract?.price?.priceWords }}</span>
            </div>
            <div class="info-box">
              <span class="ml-3">نسبة المدفوع : </span><span>{{ contract?.price?.paid }}</span>
            </div>
          </div>

          <div class="font-medium mt-2">
            و يعترف الطرف الاول بانه قد قبض من الطرف الثاني عربون وقدره :
          </div>
          <div class="grid grid-cols-2 gap-1 mt-1">
            <div class="info-box">
              <span class="ml-3">العربون : </span><span>{{ contract?.price?.downPayment }}</span>
            </div>
            <div class="info-box">
              <span class="ml-3">المتبقي : </span><span>{{ contract?.price?.remaining }}</span>
            </div>
          </div>

          <div class="font-medium mt-2">
            ثالثا / إذا امتنع الطرف الأول عن اجراء التقرير او نكل عن البيع باي صورة كانت فانه يكون
            ملزما باعداة العربون الى الطرف الثاني و ما عدا ذلك يتعهد بتادية تضمينات الطرف الثاني و
            قدرها :
          </div>
          <div class="info-box mt-1">
            <span class="ml-3">التضمينات : </span> <span>{{ contract?.price?.inclusions }}</span>
          </div>

          <div class="terms-list">
            <p>
              رابعا / يعترف الطرف الثاني بأنه قد قبل الشراء بالشروط المذكورة أنفا ويتعهد بتأدية قصور
              بدل البيع للطرف الأول عند اكمال المعاملة والتقرير في دائرة التسجيل العقاري واذا نكل في
              الشراء وتأدية قصور البدل فانه يتعهد بتادية تضمينات قدرها ({{
                contract?.price?.inclusions
              }}) وبدون الحاجة الى انذار رسمي وليس له الحق بالمطالبة بالعربون ويحق للطرف الثاني ان
              يقرر الملك باسم من يشاء.
            </p>
            <p>خامسا / ان جميع الرسوم المقتضية للشراء وسائر المصاريف هي بعهدة الطرف الثاني.</p>
            <p>
              سادسا / رسوم الفك والانتقال والافراز والتوحيد والتصحيح وضريبة الملك هي في عهدة الطرف
              الاول.
            </p>
            <p>سابعا / المكتب يخلي المسؤليه القانونيه عند التنازل من قبل مالكي الارض.</p>
            <p>ثامنا / رسوم الدلالية 1% من كل طرف.</p>
            <p>تاسعا / المكتب وسيط .</p>
            <p>عاشرا / المكتب غير مسؤل عن الامور القانونية و كافة مشاريع الدولة.</p>
          </div>

          <div class="additionals">
            <div>فقرات اضافية :</div>
            <div class="flex items-start flex-col justify-center mt-2 additional-clauses">
              <div class="additional-clauses-item">
                <span class="ml-3">الفقرة 1 : </span
                ><span>{{ contract?.additional?.clause1 }}</span>
              </div>
              <div class="additional-clauses-item">
                <span class="ml-3">الفقرة 2 : </span
                ><span>{{ contract?.additional?.clause2 }}</span>
              </div>
            </div>
          </div>

          <div class="font-medium mt-2">
            فبناء على حصول التراضي و الايجاب و القبول حرر هذا العقد بتاريخ
            <span> ({{ new Date().toLocaleDateString('ar-EG-u-nu-latn') }}) </span>
          </div>
        </div>
      </div>

      <div class="footer flex items-center justify-between mt-auto pt-2">
        <p class="signature-field">
          <span>الطرف الاول</span><span class="font-black">{{ contract?.seller?.name }}</span>
        </p>
        <p class="signature-field">
          <span>الشاهد الاول</span><span class="font-black">&nbsp;</span>
        </p>
        <p class="signature-field">
          <span>الطرف الثاني</span><span class="font-black">{{ contract?.buyer?.name }}</span>
        </p>
        <p class="signature-field">
          <span>الشاهد الثاني</span><span class="font-black">&nbsp;</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
// Script remains the same
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const contract = ref({})
const route = useRoute()

const print = () => {
  window.print()
}

onMounted(() => {
  if (route.query.contract) {
    try {
      contract.value = JSON.parse(route.query.contract)
    } catch (e) {
      console.error('Failed to parse contract:', e)
      contract.value = {}
    }
  } else {
    console.warn('No contract found in query parameters.')
    contract.value = {}
  }
})
</script>

<style lang="scss">
/* --- General Styles --- */
@font-face {
  font-family: 'Cairo';
  src: url('../assets/fonts/cairo/Cairo-Regular.ttf') format('truetype');
  font-weight: 400;
}

@font-face {
  font-family: 'Cairo';
  src: url('../assets/fonts/cairo/Cairo-Bold.ttf') format('truetype');
  font-weight: 700;
}

body {
  font-family: 'Cairo', sans-serif !important;
  background-color: #ccc; /* To see the page boundaries */
}

.page-container {
  width: 210mm;
  min-height: 297mm;
  margin: 10px auto;
  background: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  position: relative;
  box-sizing: border-box;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    pointer-events: none;
    z-index: 1;
    opacity: 0.4;
    width: 630px;
    height: 630px;
    background: {
      image: url('../assets/al_nakheel_logo.jpg');
      position: top right;
      size: cover;
      repeat: no-repeat;
    }
  }
}

.page-content {
  position: relative;
  padding: 10mm; /* Reduced padding */
  display: flex;
  flex-direction: column;
  height: 297mm; /* Fixed height */
  box-sizing: border-box;
  z-index: 2;

  p,
  span {
    font-size: 14px;
  }
}

.window-border {
  position: absolute;
  top: 5mm;
  left: 5mm;
  right: 5mm;
  bottom: 5mm;
  border: 3px double #000;
  pointer-events: none;
}

.header .logo img {
  max-width: 120px;
}

.info-box {
  background-color: #f3f4f6;
  padding: 4px 6px;
  border: 1px solid #d1d5db;
  display: flex;
  align-items: center;
  justify-content: right;
  font-size: 12px;
}

.signature-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: center;
  font-size: 12px;
}

.terms-list {
  font-size: 12px;
  line-height: 1.4;
  margin-top: 8px;
  p {
    margin-bottom: 4px;
  }
}

.additional-clauses {
  .additional-clauses-item {
    padding: 4px 6px;
    margin-bottom: 4px;
    font-size: 12px;
  }
}

/* --- Print Styles --- */
@media print {
  @page {
    size: A4 portrait;
    margin: 0;
  }

  html,
  body {
    width: 210mm;
    height: 297mm;
    margin: 0;
    padding: 0;
    background: #fff;
  }

  body * {
    visibility: hidden;
  }
  #printable,
  #printable * {
    visibility: visible;
  }
  .hide-in-print {
    display: none !important;
  }

  #printable {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    box-shadow: none;
    margin: 0;
  }

  .page-content {
    padding: 8mm 8mm; /* Fine-tuned padding for print */
    height: 100%;
  }

  .page-container {
    position: relative;

    &::before {
      display: block;
    }
  }

  .window-border {
    top: 7mm;
    left: 5mm;
    right: 5mm;
    bottom: 7mm;
    border-width: 3px;
  }

  /* Aggressive font size reduction */
  .besmallah p {
    font-size: 14px !important;
  }
  .header h1 {
    font-size: 13px !important;
  }
  .header p {
    font-size: 12px !important;
    line-height: 1.2;
  }
  .slogan p {
    font-size: 14px !important;
  }
  .under-header p {
    font-size: 10px !important;
  }
  .content {
    font-size: 11px !important;
  }
  .font-bold.text-base {
    font-size: 12px !important;
  }
  .font-medium.text-base {
    font-size: 12px !important;
    line-height: 1.4;
  }
  .info-box {
    padding: 2px 4px;
    font-size: 10px !important;
  }
  .terms-list {
    font-size: 13px !important;
    line-height: 1.35;
  }
  .signature-field {
    font-size: 13px !important;
  }

  .header .logo img {
    max-width: 75px !important;
  }

  /* Aggressive margin/padding reduction */
  .mb-2 {
    margin-bottom: 4px !important;
  }
  .my-2 {
    margin-top: 3px !important;
    margin-bottom: 3px !important;
  }
  .mt-1 {
    margin-top: 2px !important;
  }
  .mt-2 {
    margin-top: 4px !important;
  }
  .pa-1 {
    padding: 2px !important;
  }
  .pa-2 {
    padding: 4px !important;
  }
  .gap-1 {
    gap: 2px !important;
  }
  .gap-2 {
    gap: 3px !important;
  }
  .footer {
    padding-top: 4px !important;
    padding-bottom: 25px !important;
  }
}
</style>
