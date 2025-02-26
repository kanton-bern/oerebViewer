interface Extract {
  RealEstate?: {
    EGRID?: string;
    Number?: string;
    MunicipalityName?: string;
    MunicipalityCode?: string;
    SubunitOfLandRegister?: string;
  };
  CreationDate?: string;
  MunicipalityLogoRef?: string;
}

interface TemplateVars {
  EGRID?: string;
  number?: string;
  municipality?: string;
  municipalityCode?: string;
  creationDate?: string;
  municipalityLogo?: string;
  subunitOfLandRegister?: string;
  [key: string]: string | undefined;
}

export const extractToTemplateVars = (extract: Extract | undefined, defaults: TemplateVars = {}): TemplateVars => {
  const vars: TemplateVars = Object.assign({}, defaults, {
    EGRID: extract?.RealEstate?.EGRID || defaults?.EGRID,
    number: extract?.RealEstate?.Number || defaults?.number,
    municipality:
      extract?.RealEstate?.MunicipalityName || defaults?.municipality,
    municipalityCode:
      extract?.RealEstate?.MunicipalityCode || defaults?.municipalityCode,
    creationDate: extract?.CreationDate || defaults?.creationDate,
    municipalityLogo:
      extract?.MunicipalityLogoRef || defaults?.municipalityLogo,
    subunitOfLandRegister:
      extract?.RealEstate?.SubunitOfLandRegister ||
      defaults?.subunitOfLandRegister,
  })

  Object.entries(vars).forEach(([key, value]) => {
    vars[`${key}Uppercase`] =
      typeof value === 'string' ? value.toUpperCase() : value
  })

  return vars
}
