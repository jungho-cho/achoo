import type { ArticleSource } from "./schema";

export const ARTICLE_SOURCES: Record<string, ArticleSource> = {
  "cdc-allergens-pollen": {
    id: "cdc-allergens-pollen",
    title: "Allergens and Pollen",
    href: "https://www.cdc.gov/climate-health/php/effects/allergens-and-pollen.html",
    publisher: "CDC",
  },
  "cdc-pollen-health": {
    id: "cdc-pollen-health",
    title: "Pollen and Your Health",
    href: "https://www.cdc.gov/climate-health/php/effects/pollen-health.html",
    publisher: "CDC",
  },
  "kdca-pollen-guide": {
    id: "kdca-pollen-guide",
    title: "꽃가루 알레르기 주의와 예방법",
    href: "https://health.kdca.go.kr/healthinfo/biz/health/gnrlzHealthInfo/gnrlzHealthInfo/gnrlzHealthInfoView.do?cntnts_sn=66",
    publisher: "KDCA",
  },
  "kdca-eye-allergy": {
    id: "kdca-eye-allergy",
    title: "알레르기 결막염 건강정보",
    href: "https://health.kdca.go.kr/healthinfo/biz/health/gnrlzHealthInfo/gnrlzHealthInfo/gnrlzHealthInfoView.do?cntnts_sn=5266",
    publisher: "KDCA",
  },
  "kma-life-index": {
    id: "kma-life-index",
    title: "생활기상정보 지수 소개",
    href: "https://www.weather.go.kr/w/theme/daily-life/life-weather-info-index.do?nolayout=Y",
    publisher: "KMA",
  },
  "kma-pollen-index-table": {
    id: "kma-pollen-index-table",
    title: "꽃가루농도 위험지수 기준표",
    href: "https://www.weather.go.kr/w/resources/jsp/life/jisu_data_table.html",
    publisher: "KMA",
  },
  "acaai-worse-every-year": {
    id: "acaai-worse-every-year",
    title: "What’s causing my allergy symptoms to get worse every year?",
    href: "https://acaai.org/resource/whats-causing-my-allergy-symptoms-to-get-worse-every-year/",
    publisher: "ACAAI",
  },
  "acaai-pfas": {
    id: "acaai-pfas",
    title: "Pollen Food Allergy Syndrome",
    href: "https://acaai.org/allergies/allergic-conditions/food/pollen-food-allergy-syndrome/",
    publisher: "ACAAI",
  },
  "acaai-who-gets-allergies": {
    id: "acaai-who-gets-allergies",
    title: "Who Gets Allergies?",
    href: "https://acaai.org/allergies/allergies-101/who-gets-allergies/",
    publisher: "ACAAI",
  },
  "acaai-seasonal-allergies": {
    id: "acaai-seasonal-allergies",
    title: "Seasonal Allergies",
    href: "https://acaai.org/allergies/allergic-conditions/seasonal-allergies/",
    publisher: "ACAAI",
  },
  "acaai-anaphylaxis": {
    id: "acaai-anaphylaxis",
    title: "Anaphylaxis",
    href: "https://acaai.org/allergies/symptoms/anaphylaxis/",
    publisher: "ACAAI",
  },
  "aaaai-hay-fever": {
    id: "aaaai-hay-fever",
    title: "Hay Fever and Pollen Counts",
    href: "https://www.aaaai.org/tools-for-the-public/conditions-library/allergies/hay-fever-and-pollen-counts",
    publisher: "AAAAI",
  },
  "aaaai-outdoor-allergens": {
    id: "aaaai-outdoor-allergens",
    title: "Outdoor Allergens",
    href: "https://www.aaaai.org/tools-for-the-public/conditions-library/allergies/outdoor-allergens-ttr",
    publisher: "AAAAI",
  },
  "aaaai-eye-allergy": {
    id: "aaaai-eye-allergy",
    title: "Eye (Ocular) Allergy",
    href: "https://www.aaaai.org/conditions-treatments/allergies/eye-%28ocular%29-allergy",
    publisher: "AAAAI",
  },
  "aaaai-exercise-asthma": {
    id: "aaaai-exercise-asthma",
    title: "Exercise and Asthma",
    href: "https://www.aaaai.org/tools-for-the-public/conditions-library/asthma/exercise-and-asthma",
    publisher: "AAAAI",
  },
  "epa-hepa": {
    id: "epa-hepa",
    title: "What is a HEPA filter?",
    href: "https://www.epa.gov/indoor-air-quality-iaq/what-hepa-filter",
    publisher: "EPA",
  },
  "epa-air-cleaners": {
    id: "epa-air-cleaners",
    title: "Guide to Air Cleaners in the Home",
    href: "https://www.epa.gov/indoor-air-quality-iaq/guide-air-cleaners-home",
    publisher: "EPA",
  },
  "pubmed-thunderstorm-2025": {
    id: "pubmed-thunderstorm-2025",
    title: "Thunderstorm Asthma: Current Perspectives and Emerging Trends",
    href: "https://pubmed.ncbi.nlm.nih.gov/40199421/",
    publisher: "PubMed",
  },
  "pubmed-thunderstorm-2026": {
    id: "pubmed-thunderstorm-2026",
    title:
      "Stormy Outlook: A review of thunderstorm asthma risk factors and management",
    href: "https://pubmed.ncbi.nlm.nih.gov/41652394/",
    publisher: "PubMed",
  },
  "pubmed-pollution-review": {
    id: "pubmed-pollution-review",
    title:
      "The interactions between pollen exposure, air pollution and climate change",
    href: "https://pubmed.ncbi.nlm.nih.gov/34870078/",
    publisher: "PubMed",
  },
  "donga-kma-pollen-2026": {
    id: "donga-kma-pollen-2026",
    title: "4월 꽃가루 지수, 전년보다 4배 이상 증가",
    href: "https://www.donga.com/news/amp/all/20260417/133757552/1",
    publisher: "Donga / Newsis",
  },
  "korea-national-arboretum-pine-pollen-2026": {
    id: "korea-national-arboretum-pine-pollen-2026",
    title: "송홧가루 비산 시기 조기화 분석",
    href: "https://news.nate.com/view/20260423n13110",
    publisher: "Korea National Arboretum / Newsis",
  },
  "climate-central-2026-allergy-season": {
    id: "climate-central-2026-allergy-season",
    title: "2026 Allergy Season",
    href: "https://www.climatecentral.org/climate-matters/2026-allergy-season",
    publisher: "Climate Central",
  },
  "guardian-lancet-europe-pollen-2026": {
    id: "guardian-lancet-europe-pollen-2026",
    title: "Pollen season in UK and mainland Europe extended by climate breakdown",
    href: "https://www.theguardian.com/environment/2026/apr/22/pollen-season-in-uk-and-mainland-europe-extended-by-climate-breakdown",
    publisher: "The Guardian",
  },
  "cdc-common-cold": {
    id: "cdc-common-cold",
    title: "About Common Cold",
    href: "https://www.cdc.gov/common-cold/about/index.html",
    publisher: "CDC",
  },
  "cdc-pink-eye-symptoms": {
    id: "cdc-pink-eye-symptoms",
    title: "Symptoms of Pink Eye",
    href: "https://www.cdc.gov/conjunctivitis/signs-symptoms/index.html",
    publisher: "CDC",
  },
  "mayo-itchy-skin": {
    id: "mayo-itchy-skin",
    title: "Itchy skin: Symptoms and causes",
    href: "https://www.mayoclinic.org/diseases-conditions/itchy-skin/symptoms-causes/syc-20355006",
    publisher: "Mayo Clinic",
  },
  "mayo-contact-dermatitis": {
    id: "mayo-contact-dermatitis",
    title: "Contact dermatitis: Symptoms and causes",
    href: "https://www.mayoclinic.org/diseases-conditions/contact-dermatitis/symptoms-causes/syc-20352742",
    publisher: "Mayo Clinic",
  },
};
