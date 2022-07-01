/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export type Extract = GetExtractByIdResponse | GetEGRIDResponse | GetCapabilitiesResponse;
export type GetEGRIDResponse = {
  egrid?: string;
  number?: string;
  identDN?: string;
  type?: {
    Code?:
      | "RealEstate"
      | "Distinct_and_permanent_rights.BuildingRight"
      | "Distinct_and_permanent_rights.right_to_spring_water"
      | "Distinct_and_permanent_rights.concession"
      | "Distinct_and_permanent_rights.other"
      | "Mineral_rights";
    Text?: [
      {
        Language?: "de" | "fr" | "it" | "rm" | "en";
        Text?: string;
        [k: string]: unknown;
      },
      ...{
        Language?: "de" | "fr" | "it" | "rm" | "en";
        Text?: string;
        [k: string]: unknown;
      }[]
    ];
    [k: string]: unknown;
  };
  limit?: {
    type?: "MultiPolygon" | "MultiCurvePolygon";
    coordinates?: [
      [[number, number, ...number[]][], ...[number, number, ...number[]][][]],
      ...[[number, number, ...number[]][], ...[number, number, ...number[]][][]][]
    ];
    crs?: string;
    isosqlmmwkb?: {
      [k: string]: unknown;
    };
    [k: string]: unknown;
  };
  [k: string]: unknown;
}[];

export interface GetExtractByIdResponse {
  extract?: {
    CreationDate?: {
      [k: string]: unknown;
    };
    Signature?: {
      [k: string]: unknown;
    };
    ConcernedTheme?: {
      Code?: {
        [k: string]: unknown;
      };
      SubCode?: {
        [k: string]: unknown;
      };
      Text?: [
        {
          Language?: "de" | "fr" | "it" | "rm" | "en";
          Text?: string;
          [k: string]: unknown;
        },
        ...{
          Language?: "de" | "fr" | "it" | "rm" | "en";
          Text?: string;
          [k: string]: unknown;
        }[]
      ];
      [k: string]: unknown;
    }[];
    NotConcernedTheme?: {
      Code?: {
        [k: string]: unknown;
      };
      SubCode?: {
        [k: string]: unknown;
      };
      Text?: [
        {
          Language?: "de" | "fr" | "it" | "rm" | "en";
          Text?: string;
          [k: string]: unknown;
        },
        ...{
          Language?: "de" | "fr" | "it" | "rm" | "en";
          Text?: string;
          [k: string]: unknown;
        }[]
      ];
      [k: string]: unknown;
    }[];
    ThemeWithoutData?: {
      Code?: {
        [k: string]: unknown;
      };
      SubCode?: {
        [k: string]: unknown;
      };
      Text?: [
        {
          Language?: "de" | "fr" | "it" | "rm" | "en";
          Text?: string;
          [k: string]: unknown;
        },
        ...{
          Language?: "de" | "fr" | "it" | "rm" | "en";
          Text?: string;
          [k: string]: unknown;
        }[]
      ];
      [k: string]: unknown;
    }[];
    LogoPLRCadastre?: {
      [k: string]: unknown;
    };
    LogoPLRCadastreRef?: string;
    FederalLogo?: {
      [k: string]: unknown;
    };
    FederalLogoRef?: string;
    CantonalLogo?: {
      [k: string]: unknown;
    };
    CantonalLogoRef?: string;
    MunicipalityLogo?: {
      [k: string]: unknown;
    };
    MunicipalityLogoRef?: string;
    ExtractIdentifier?: string;
    QRCode?: {
      [k: string]: unknown;
    };
    QRCodeRef?: string;
    GeneralInformation?: [
      {
        Language?: "de" | "fr" | "it" | "rm" | "en";
        Text?: string;
        [k: string]: unknown;
      },
      ...{
        Language?: "de" | "fr" | "it" | "rm" | "en";
        Text?: string;
        [k: string]: unknown;
      }[]
    ];
    Glossary?: {
      Title?: [
        {
          Language?: "de" | "fr" | "it" | "rm" | "en";
          Text?: string;
          [k: string]: unknown;
        },
        ...{
          Language?: "de" | "fr" | "it" | "rm" | "en";
          Text?: string;
          [k: string]: unknown;
        }[]
      ];
      Content?: [
        {
          Language?: "de" | "fr" | "it" | "rm" | "en";
          Text?: string;
          [k: string]: unknown;
        },
        ...{
          Language?: "de" | "fr" | "it" | "rm" | "en";
          Text?: string;
          [k: string]: unknown;
        }[]
      ];
      [k: string]: unknown;
    }[];
    RealEstate?: {
      Number?: string;
      IdentDN?: string;
      EGRID?: string;
      Type?: {
        Code?:
          | "RealEstate"
          | "Distinct_and_permanent_rights.BuildingRight"
          | "Distinct_and_permanent_rights.right_to_spring_water"
          | "Distinct_and_permanent_rights.concession"
          | "Distinct_and_permanent_rights.other"
          | "Mineral_rights";
        Text?: [
          {
            Language?: "de" | "fr" | "it" | "rm" | "en";
            Text?: string;
            [k: string]: unknown;
          },
          ...{
            Language?: "de" | "fr" | "it" | "rm" | "en";
            Text?: string;
            [k: string]: unknown;
          }[]
        ];
        [k: string]: unknown;
      };
      Canton?:
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
      MunicipalityName?: string;
      MunicipalityCode?: number;
      SubunitOfLandRegister?: string;
      SubunitOfLandRegisterDesignation?: string;
      MetadataOfGeographicalBaseData?: string;
      LandRegistryArea?: number;
      Limit?: {
        type?: "MultiPolygon" | "MultiCurvePolygon";
        coordinates?: [
          [[number, number, ...number[]][], ...[number, number, ...number[]][][]],
          ...[[number, number, ...number[]][], ...[number, number, ...number[]][][]][]
        ];
        crs?: string;
        isosqlmmwkb?: {
          [k: string]: unknown;
        };
        [k: string]: unknown;
      };
      RestrictionOnLandownership?: {
        LegendText?: [
          {
            Language?: "de" | "fr" | "it" | "rm" | "en";
            Text?: string;
            [k: string]: unknown;
          },
          ...{
            Language?: "de" | "fr" | "it" | "rm" | "en";
            Text?: string;
            [k: string]: unknown;
          }[]
        ];
        Theme?: {
          Code?: {
            [k: string]: unknown;
          };
          SubCode?: {
            [k: string]: unknown;
          };
          Text?: [
            {
              Language?: "de" | "fr" | "it" | "rm" | "en";
              Text?: string;
              [k: string]: unknown;
            },
            ...{
              Language?: "de" | "fr" | "it" | "rm" | "en";
              Text?: string;
              [k: string]: unknown;
            }[]
          ];
          [k: string]: unknown;
        };
        TypeCode?: string;
        TypeCodelist?: string;
        Lawstatus?: {
          Code?: "inForce" | "changeWithPreEffect" | "changeWithoutPreEffect";
          Text?: [
            {
              Language?: "de" | "fr" | "it" | "rm" | "en";
              Text?: string;
              [k: string]: unknown;
            },
            ...{
              Language?: "de" | "fr" | "it" | "rm" | "en";
              Text?: string;
              [k: string]: unknown;
            }[]
          ];
          [k: string]: unknown;
        };
        AreaShare?: number;
        PartInPercent?: number;
        LengthShare?: number;
        NrOfPoints?: number;
        Symbol?: {
          [k: string]: unknown;
        };
        SymbolRef?: string;
        Geometry?: {
          Point?: {
            type?: "Point";
            coordinates?: [number, number, ...number[]];
            crs?: string;
            [k: string]: unknown;
          };
          Line?: {
            type?: "LineString" | "CompoundCurve";
            coordinates?: [number, number, ...number[]][];
            crs?: string;
            isosqlmmwkb?: {
              [k: string]: unknown;
            };
            [k: string]: unknown;
          };
          Surface?: {
            type?: "Polygon" | "CurvePolygon";
            coordinates?: [[number, number, ...number[]][], ...[number, number, ...number[]][][]];
            crs?: string;
            isosqlmmwkb?: {
              [k: string]: unknown;
            };
            [k: string]: unknown;
          };
          Lawstatus?: {
            Code?: "inForce" | "changeWithPreEffect" | "changeWithoutPreEffect";
            Text?: [
              {
                Language?: "de" | "fr" | "it" | "rm" | "en";
                Text?: string;
                [k: string]: unknown;
              },
              ...{
                Language?: "de" | "fr" | "it" | "rm" | "en";
                Text?: string;
                [k: string]: unknown;
              }[]
            ];
            [k: string]: unknown;
          };
          MetadataOfGeographicalBaseData?: string;
          [k: string]: unknown;
        }[];
        Map?: {
          Image?: [
            {
              Language?: "de" | "fr" | "it" | "rm" | "en";
              Blob?: {
                [k: string]: unknown;
              };
              [k: string]: unknown;
            },
            ...{
              Language?: "de" | "fr" | "it" | "rm" | "en";
              Blob?: {
                [k: string]: unknown;
              };
              [k: string]: unknown;
            }[]
          ];
          ReferenceWMS?: [
            {
              Language?: "de" | "fr" | "it" | "rm" | "en";
              Text?: string;
              [k: string]: unknown;
            },
            ...{
              Language?: "de" | "fr" | "it" | "rm" | "en";
              Text?: string;
              [k: string]: unknown;
            }[]
          ];
          OtherLegend?: {
            Symbol?: {
              [k: string]: unknown;
            };
            SymbolRef?: string;
            LegendText?: [
              {
                Language?: "de" | "fr" | "it" | "rm" | "en";
                Text?: string;
                [k: string]: unknown;
              },
              ...{
                Language?: "de" | "fr" | "it" | "rm" | "en";
                Text?: string;
                [k: string]: unknown;
              }[]
            ];
            TypeCode?: string;
            TypeCodelist?: string;
            Theme?: {
              Code?: {
                [k: string]: unknown;
              };
              SubCode?: {
                [k: string]: unknown;
              };
              Text?: [
                {
                  Language?: "de" | "fr" | "it" | "rm" | "en";
                  Text?: string;
                  [k: string]: unknown;
                },
                ...{
                  Language?: "de" | "fr" | "it" | "rm" | "en";
                  Text?: string;
                  [k: string]: unknown;
                }[]
              ];
              [k: string]: unknown;
            };
            [k: string]: unknown;
          }[];
          min?: {
            type?: "Point";
            coordinates?: [number, number, ...number[]];
            crs?: string;
            [k: string]: unknown;
          };
          max?: {
            type?: "Point";
            coordinates?: [number, number, ...number[]];
            crs?: string;
            [k: string]: unknown;
          };
          layerIndex?: number;
          layerOpacity?: number;
          [k: string]: unknown;
        };
        LegalProvisions?: {
          Type?: {
            Code?: {
              [k: string]: unknown;
            };
            Text?: [
              {
                Language?: "de" | "fr" | "it" | "rm" | "en";
                Text?: string;
                [k: string]: unknown;
              },
              ...{
                Language?: "de" | "fr" | "it" | "rm" | "en";
                Text?: string;
                [k: string]: unknown;
              }[]
            ];
            [k: string]: unknown;
          };
          Title?: [
            {
              Language?: "de" | "fr" | "it" | "rm" | "en";
              Text?: string;
              [k: string]: unknown;
            },
            ...{
              Language?: "de" | "fr" | "it" | "rm" | "en";
              Text?: string;
              [k: string]: unknown;
            }[]
          ];
          Abbreviation?: [
            {
              Language?: "de" | "fr" | "it" | "rm" | "en";
              Text?: string;
              [k: string]: unknown;
            },
            ...{
              Language?: "de" | "fr" | "it" | "rm" | "en";
              Text?: string;
              [k: string]: unknown;
            }[]
          ];
          OfficialNumber?: [
            {
              Language?: "de" | "fr" | "it" | "rm" | "en";
              Text?: string;
              [k: string]: unknown;
            },
            ...{
              Language?: "de" | "fr" | "it" | "rm" | "en";
              Text?: string;
              [k: string]: unknown;
            }[]
          ];
          TextAtWeb?: [
            {
              Language?: "de" | "fr" | "it" | "rm" | "en";
              Text?: string;
              [k: string]: unknown;
            },
            ...{
              Language?: "de" | "fr" | "it" | "rm" | "en";
              Text?: string;
              [k: string]: unknown;
            }[]
          ];
          ArticleNumber?: string[];
          Lawstatus?: {
            Code?: "inForce" | "changeWithPreEffect" | "changeWithoutPreEffect";
            Text?: [
              {
                Language?: "de" | "fr" | "it" | "rm" | "en";
                Text?: string;
                [k: string]: unknown;
              },
              ...{
                Language?: "de" | "fr" | "it" | "rm" | "en";
                Text?: string;
                [k: string]: unknown;
              }[]
            ];
            [k: string]: unknown;
          };
          Index?: number;
          ResponsibleOffice?: {
            Name?: [
              {
                Language?: "de" | "fr" | "it" | "rm" | "en";
                Text?: string;
                [k: string]: unknown;
              },
              ...{
                Language?: "de" | "fr" | "it" | "rm" | "en";
                Text?: string;
                [k: string]: unknown;
              }[]
            ];
            OfficeAtWeb?: [
              {
                Language?: "de" | "fr" | "it" | "rm" | "en";
                Text?: string;
                [k: string]: unknown;
              },
              ...{
                Language?: "de" | "fr" | "it" | "rm" | "en";
                Text?: string;
                [k: string]: unknown;
              }[]
            ];
            UID?: string;
            Line1?: string;
            Line2?: string;
            Street?: string;
            Number?: string;
            PostalCode?: string;
            City?: string;
            [k: string]: unknown;
          };
          [k: string]: unknown;
        }[];
        ResponsibleOffice?: {
          Name?: [
            {
              Language?: "de" | "fr" | "it" | "rm" | "en";
              Text?: string;
              [k: string]: unknown;
            },
            ...{
              Language?: "de" | "fr" | "it" | "rm" | "en";
              Text?: string;
              [k: string]: unknown;
            }[]
          ];
          OfficeAtWeb?: [
            {
              Language?: "de" | "fr" | "it" | "rm" | "en";
              Text?: string;
              [k: string]: unknown;
            },
            ...{
              Language?: "de" | "fr" | "it" | "rm" | "en";
              Text?: string;
              [k: string]: unknown;
            }[]
          ];
          UID?: string;
          Line1?: string;
          Line2?: string;
          Street?: string;
          Number?: string;
          PostalCode?: string;
          City?: string;
          [k: string]: unknown;
        };
        [k: string]: unknown;
      }[];
      PlanForLandRegister?: {
        Image?: [
          {
            Language?: "de" | "fr" | "it" | "rm" | "en";
            Blob?: {
              [k: string]: unknown;
            };
            [k: string]: unknown;
          },
          ...{
            Language?: "de" | "fr" | "it" | "rm" | "en";
            Blob?: {
              [k: string]: unknown;
            };
            [k: string]: unknown;
          }[]
        ];
        ReferenceWMS?: [
          {
            Language?: "de" | "fr" | "it" | "rm" | "en";
            Text?: string;
            [k: string]: unknown;
          },
          ...{
            Language?: "de" | "fr" | "it" | "rm" | "en";
            Text?: string;
            [k: string]: unknown;
          }[]
        ];
        OtherLegend?: {
          Symbol?: {
            [k: string]: unknown;
          };
          SymbolRef?: string;
          LegendText?: [
            {
              Language?: "de" | "fr" | "it" | "rm" | "en";
              Text?: string;
              [k: string]: unknown;
            },
            ...{
              Language?: "de" | "fr" | "it" | "rm" | "en";
              Text?: string;
              [k: string]: unknown;
            }[]
          ];
          TypeCode?: string;
          TypeCodelist?: string;
          Theme?: {
            Code?: {
              [k: string]: unknown;
            };
            SubCode?: {
              [k: string]: unknown;
            };
            Text?: [
              {
                Language?: "de" | "fr" | "it" | "rm" | "en";
                Text?: string;
                [k: string]: unknown;
              },
              ...{
                Language?: "de" | "fr" | "it" | "rm" | "en";
                Text?: string;
                [k: string]: unknown;
              }[]
            ];
            [k: string]: unknown;
          };
          [k: string]: unknown;
        }[];
        min?: {
          type?: "Point";
          coordinates?: [number, number, ...number[]];
          crs?: string;
          [k: string]: unknown;
        };
        max?: {
          type?: "Point";
          coordinates?: [number, number, ...number[]];
          crs?: string;
          [k: string]: unknown;
        };
        layerIndex?: number;
        layerOpacity?: number;
        [k: string]: unknown;
      };
      PlanForLandRegisterMainPage?: {
        Image?: [
          {
            Language?: "de" | "fr" | "it" | "rm" | "en";
            Blob?: {
              [k: string]: unknown;
            };
            [k: string]: unknown;
          },
          ...{
            Language?: "de" | "fr" | "it" | "rm" | "en";
            Blob?: {
              [k: string]: unknown;
            };
            [k: string]: unknown;
          }[]
        ];
        ReferenceWMS?: [
          {
            Language?: "de" | "fr" | "it" | "rm" | "en";
            Text?: string;
            [k: string]: unknown;
          },
          ...{
            Language?: "de" | "fr" | "it" | "rm" | "en";
            Text?: string;
            [k: string]: unknown;
          }[]
        ];
        OtherLegend?: {
          Symbol?: {
            [k: string]: unknown;
          };
          SymbolRef?: string;
          LegendText?: [
            {
              Language?: "de" | "fr" | "it" | "rm" | "en";
              Text?: string;
              [k: string]: unknown;
            },
            ...{
              Language?: "de" | "fr" | "it" | "rm" | "en";
              Text?: string;
              [k: string]: unknown;
            }[]
          ];
          TypeCode?: string;
          TypeCodelist?: string;
          Theme?: {
            Code?: {
              [k: string]: unknown;
            };
            SubCode?: {
              [k: string]: unknown;
            };
            Text?: [
              {
                Language?: "de" | "fr" | "it" | "rm" | "en";
                Text?: string;
                [k: string]: unknown;
              },
              ...{
                Language?: "de" | "fr" | "it" | "rm" | "en";
                Text?: string;
                [k: string]: unknown;
              }[]
            ];
            [k: string]: unknown;
          };
          [k: string]: unknown;
        }[];
        min?: {
          type?: "Point";
          coordinates?: [number, number, ...number[]];
          crs?: string;
          [k: string]: unknown;
        };
        max?: {
          type?: "Point";
          coordinates?: [number, number, ...number[]];
          crs?: string;
          [k: string]: unknown;
        };
        layerIndex?: number;
        layerOpacity?: number;
        [k: string]: unknown;
      };
      [k: string]: unknown;
    };
    Disclaimer?: {
      Title?: [
        {
          Language?: "de" | "fr" | "it" | "rm" | "en";
          Text?: string;
          [k: string]: unknown;
        },
        ...{
          Language?: "de" | "fr" | "it" | "rm" | "en";
          Text?: string;
          [k: string]: unknown;
        }[]
      ];
      Content?: [
        {
          Language?: "de" | "fr" | "it" | "rm" | "en";
          Text?: string;
          [k: string]: unknown;
        },
        ...{
          Language?: "de" | "fr" | "it" | "rm" | "en";
          Text?: string;
          [k: string]: unknown;
        }[]
      ];
      [k: string]: unknown;
    }[];
    PLRCadastreAuthority?: {
      Name?: [
        {
          Language?: "de" | "fr" | "it" | "rm" | "en";
          Text?: string;
          [k: string]: unknown;
        },
        ...{
          Language?: "de" | "fr" | "it" | "rm" | "en";
          Text?: string;
          [k: string]: unknown;
        }[]
      ];
      OfficeAtWeb?: [
        {
          Language?: "de" | "fr" | "it" | "rm" | "en";
          Text?: string;
          [k: string]: unknown;
        },
        ...{
          Language?: "de" | "fr" | "it" | "rm" | "en";
          Text?: string;
          [k: string]: unknown;
        }[]
      ];
      UID?: string;
      Line1?: string;
      Line2?: string;
      Street?: string;
      Number?: string;
      PostalCode?: string;
      City?: string;
      [k: string]: unknown;
    };
    UpdateDateOS?: {
      [k: string]: unknown;
    };
    [k: string]: unknown;
  };
  [k: string]: unknown;
}
export interface GetCapabilitiesResponse {
  topic?: {
    Code?: {
      [k: string]: unknown;
    };
    SubCode?: {
      [k: string]: unknown;
    };
    Text?: [
      {
        Language?: "de" | "fr" | "it" | "rm" | "en";
        Text?: string;
        [k: string]: unknown;
      },
      ...{
        Language?: "de" | "fr" | "it" | "rm" | "en";
        Text?: string;
        [k: string]: unknown;
      }[]
    ];
    [k: string]: unknown;
  }[];
  municipality?: number[];
  flavour?: FlavourType[];
  language?: string[];
  crs?: string[];
  [k: string]: unknown;
}
export interface FlavourType {
  [k: string]: unknown;
}