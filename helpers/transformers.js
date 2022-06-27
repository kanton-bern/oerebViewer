export const extractToTemplateVars = (extract, defaults = {}) => {
  const vars = Object.assign({}, defaults, {
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
