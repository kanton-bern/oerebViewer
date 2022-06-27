/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export type Extractdata = Extract;
export type MultilingualText = [LocalisedText, ...LocalisedText[]];
export type LanguageCode = "de" | "fr" | "it" | "rm" | "en";
export type AnyURI = string;
export type MultilingualMText = [LocalisedMText, ...LocalisedMText[]];
export type RealEstateTypeCode =
  | "RealEstate"
  | "Distinct_and_permanent_rights.BuildingRight"
  | "Distinct_and_permanent_rights.right_to_spring_water"
  | "Distinct_and_permanent_rights.concession"
  | "Distinct_and_permanent_rights.other"
  | "Mineral_rights";
export type CantonCode =
  | "ZH"
  | "BE"
  | "LU"
  | "UR"
  | "SZ"
  | "OW"
  | "NW"
  | "GL"
  | "ZG"
  | "FR"
  | "SO"
  | "BS"
  | "BL"
  | "SH"
  | "AR"
  | "AI"
  | "SG"
  | "GR"
  | "AG"
  | "TG"
  | "TI"
  | "VD"
  | "VS"
  | "NE"
  | "GE"
  | "JU"
  | "FL";
export type MunicipalityCode = number;
export type Area = number;
export type Position = [number, number, ...number[]];
export type PositionArray = Position[];
export type RestrictiontypeCode = string;
export type LawstatusCode = "inForce" | "changeWithPreEffect" | "changeWithoutPreEffect";
export type Length = number;
export type MultilingualBlob = [LocalisedBlob, ...LocalisedBlob[]];
export type MultilingualUri = [LocalisedUri, ...LocalisedUri[]];
export type ArticleNumber = string;
export type UID = string;

export interface Extract {
  CreationDate?: DateTime;
  Signature?: Signature;
  ConcernedTheme?: Theme[];
  NotConcernedTheme?: Theme[];
  ThemeWithoutData?: Theme[];
  LogoPLRCadastre?: Base64Binary;
  LogoPLRCadastreRef?: AnyURI;
  FederalLogo?: Base64Binary;
  FederalLogoRef?: AnyURI;
  CantonalLogo?: Base64Binary;
  CantonalLogoRef?: AnyURI;
  MunicipalityLogo?: Base64Binary;
  MunicipalityLogoRef?: AnyURI;
  ExtractIdentifier?: string;
  QRCode?: Base64Binary;
  QRCodeRef?: AnyURI;
  GeneralInformation?: MultilingualMText;
  Glossary?: Glossary[];
  RealEstate?: RealEstate_DPR;
  Disclaimer?: Disclaimer[];
  PLRCadastreAuthority?: Office;
  UpdateDateOS?: DateTime;
  [k: string]: unknown;
}
export interface DateTime {
  [k: string]: unknown;
}
export interface Signature {
  [k: string]: unknown;
}
export interface Theme {
  Code?: ThemeCode;
  SubCode?: ThemeCode;
  Text?: MultilingualText;
  [k: string]: unknown;
}
export interface ThemeCode {
  [k: string]: unknown;
}
export interface LocalisedText {
  Language?: LanguageCode;
  Text?: string;
  [k: string]: unknown;
}
export interface Base64Binary {
  [k: string]: unknown;
}
export interface LocalisedMText {
  Language?: LanguageCode;
  Text?: string;
  [k: string]: unknown;
}
export interface Glossary {
  Title?: MultilingualText;
  Content?: MultilingualMText;
  [k: string]: unknown;
}
export interface RealEstate_DPR {
  Number?: string;
  IdentDN?: string;
  EGRID?: string;
  Type?: RealEstateType;
  Canton?: CantonCode;
  MunicipalityName?: string;
  MunicipalityCode?: MunicipalityCode;
  SubunitOfLandRegister?: string;
  SubunitOfLandRegisterDesignation?: string;
  MetadataOfGeographicalBaseData?: AnyURI;
  LandRegistryArea?: Area;
  Limit?: MultiSurface;
  RestrictionOnLandownership?: RestrictionOnLandownership[];
  PlanForLandRegister?: Map;
  PlanForLandRegisterMainPage?: Map;
  [k: string]: unknown;
}
export interface RealEstateType {
  Code?: RealEstateTypeCode;
  Text?: MultilingualText;
  [k: string]: unknown;
}
export interface MultiSurface {
  type?: "MultiPolygon" | "MultiCurvePolygon";
  coordinates?: [[PositionArray, ...PositionArray[]], ...[PositionArray, ...PositionArray[]][]];
  crs?: string;
  isosqlmmwkb?: Base64Binary;
  [k: string]: unknown;
}
export interface RestrictionOnLandownership {
  LegendText?: MultilingualMText;
  Theme?: Theme;
  TypeCode?: RestrictiontypeCode;
  TypeCodelist?: AnyURI;
  Lawstatus?: Lawstatus;
  AreaShare?: Area;
  PartInPercent?: number;
  LengthShare?: Length;
  NrOfPoints?: number;
  Symbol?: Base64Binary;
  SymbolRef?: AnyURI;
  Geometry?: Geometry[];
  Map?: Map;
  LegalProvisions?: Document[];
  ResponsibleOffice?: Office;
  [k: string]: unknown;
}
export interface Lawstatus {
  Code?: LawstatusCode;
  Text?: MultilingualText;
  [k: string]: unknown;
}
export interface Geometry {
  Point?: PointPropertyType;
  Line?: CurvePropertyType;
  Surface?: SurfacePropertyType;
  Lawstatus?: Lawstatus;
  MetadataOfGeographicalBaseData?: AnyURI;
  [k: string]: unknown;
}
export interface PointPropertyType {
  type?: "Point";
  coordinates?: Position;
  crs?: string;
  [k: string]: unknown;
}
export interface CurvePropertyType {
  type?: "LineString" | "CompoundCurve";
  coordinates?: PositionArray;
  crs?: string;
  isosqlmmwkb?: Base64Binary;
  [k: string]: unknown;
}
export interface SurfacePropertyType {
  type?: "Polygon" | "CurvePolygon";
  coordinates?: [PositionArray, ...PositionArray[]];
  crs?: string;
  isosqlmmwkb?: Base64Binary;
  [k: string]: unknown;
}
export interface Map {
  Image?: MultilingualBlob;
  ReferenceWMS?: MultilingualUri;
  OtherLegend?: LegendEntry[];
  min?: PointPropertyType;
  max?: PointPropertyType;
  layerIndex?: number;
  layerOpacity?: number;
  [k: string]: unknown;
}
export interface LocalisedBlob {
  Language?: LanguageCode;
  Blob?: Base64Binary;
  [k: string]: unknown;
}
export interface LocalisedUri {
  Language?: LanguageCode;
  Text?: AnyURI;
  [k: string]: unknown;
}
export interface LegendEntry {
  Symbol?: Base64Binary;
  SymbolRef?: AnyURI;
  LegendText?: MultilingualText;
  TypeCode?: RestrictiontypeCode;
  TypeCodelist?: AnyURI;
  Theme?: Theme;
  [k: string]: unknown;
}
export interface Document {
  Type?: DocumentType;
  Title?: MultilingualText;
  Abbreviation?: MultilingualText;
  OfficialNumber?: MultilingualText;
  TextAtWeb?: MultilingualUri;
  ArticleNumber?: ArticleNumber[];
  Lawstatus?: Lawstatus;
  Index?: number;
  ResponsibleOffice?: Office;
  [k: string]: unknown;
}
export interface DocumentType {
  Code?: DocumentTypeCode;
  Text?: MultilingualText;
  [k: string]: unknown;
}
export interface DocumentTypeCode {
  [k: string]: unknown;
}
export interface Office {
  Name?: MultilingualText;
  OfficeAtWeb?: MultilingualUri;
  UID?: UID;
  Line1?: string;
  Line2?: string;
  Street?: string;
  Number?: string;
  PostalCode?: string;
  City?: string;
  [k: string]: unknown;
}
export interface Disclaimer {
  Title?: MultilingualText;
  Content?: MultilingualMText;
  [k: string]: unknown;
}
