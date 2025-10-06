import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Divider,
  Grid,
  Input,
  message,
  Row,
  Segmented,
  Select,
  Space,
  Switch,
  Table,
  Typography,
} from "antd";
import type { TableProps } from "antd";
import Upload from "antd/es/upload/Upload";
import { UploadOutlined } from "@ant-design/icons";
import { ImportSchemeModal } from "./components/ImportSchemeModal";
import {
  GetSchemes,
  setSelectedSchemeId,
} from "../../store/reducers/SchemeSlice";
import { getSchemes, Scheme } from "../../services/Scheme";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";

interface OilCollectionRecord {
  id: number;
  well: string;
  us: number | string;
  gzu: number;
  dns: number;
  otp: string;
  usRowSpan?: number;
  gzuRowSpan?: number;
  dnsRowSpan?: number;
  otpRowSpan?: number;
}

const fixedColumns: TableProps<OilCollectionRecord>["columns"] = [
  // {
  //   title: "ОТП",
  //   dataIndex: "otp",
  //   width: 80,
  //   fixed: "right",
  //   onCell: (record) => ({
  //     rowSpan: record.otpRowSpan || 0,
  //   }),
  // },
  {
    title: "ДНС",
    dataIndex: "dns",
    width: 80,
    onCell: (record) => ({
      rowSpan: record.dnsRowSpan || 0,
    }),
  },
  {
    title: "ГЗУ",
    dataIndex: "gzu",
    width: 80,
    onCell: (record) => ({
      rowSpan: record.gzuRowSpan || 0,
    }),
  },
  {
    title: "Ус",
    dataIndex: "us",
    width: 60,
    onCell: (record) => ({
      rowSpan: record.usRowSpan || 0,
    }),
  },
  {
    title: "Скваж",
    dataIndex: "well",
    width: 80,
    fixed: "left",
  },

  // {
  //   title: "Действия",
  //   width: 150,
  //   fixed: "right",
  //   render: () => (
  //     <Space>
  //       <Typography.Link>Просмотр</Typography.Link>
  //       <Typography.Link>Редакт.</Typography.Link>
  //     </Space>
  //   ),
  // },
];

const columns: TableProps<OilCollectionRecord>["columns"] = [
  {
    title: "Скваж",
    dataIndex: "well",
    width: 80,
  },
  {
    title: "Ус",
    dataIndex: "us",
    width: 60,
  },
  {
    title: "ГЗУ",
    dataIndex: "gzu",
    width: 80,
  },
  {
    title: "ДНС",
    dataIndex: "dns",
    width: 80,
  },
  {
    title: "ОТП",
    dataIndex: "otp",
    width: 80,
  },
];

// Данные о схеме сбора нефти
const oilCollectionData: OilCollectionRecord[] = [
  { id: 1, well: "1", us: 11, gzu: 513, dns: 33, otp: "ТП" },
  { id: 2, well: "2", us: 6, gzu: 513, dns: 33, otp: "ТП" },
  { id: 3, well: "3", us: 2, gzu: 513, dns: 33, otp: "ТП" },
  { id: 4, well: "4", us: 4, gzu: 513, dns: 33, otp: "ТП" },
  { id: 5, well: "5", us: 6, gzu: 513, dns: 33, otp: "ТП" },
  { id: 6, well: "6", us: 9, gzu: 893, dns: 6177, otp: "ТП" },
  { id: 7, well: "7", us: 8, gzu: 633, dns: 33, otp: "ТП" },
  { id: 8, well: "8", us: 5, gzu: 513, dns: 33, otp: "ТП" },
  { id: 9, well: "9", us: 1, gzu: 513, dns: 33, otp: "ТП" },
  { id: 10, well: "10", us: 14, gzu: 23, dns: 6177, otp: "ТП" },
  { id: 11, well: "11", us: 7, gzu: 203, dns: 33, otp: "ТП" },
  { id: 12, well: "12", us: 5, gzu: 203, dns: 33, otp: "ТП" },
  { id: 13, well: "13", us: 2, gzu: 23, dns: 6177, otp: "ТП" },
  { id: 14, well: "14", us: 7, gzu: 633, dns: 33, otp: "ТП" },
  { id: 15, well: "15", us: 8, gzu: 203, dns: 33, otp: "ТП" },
  { id: 16, well: "16", us: 14, gzu: 203, dns: 33, otp: "ТП" },
  { id: 17, well: "17", us: 13, gzu: 633, dns: 33, otp: "ТП" },
  { id: 18, well: "18", us: 8, gzu: 633, dns: 33, otp: "ТП" },
  { id: 19, well: "19", us: 5, gzu: 633, dns: 33, otp: "ТП" },
  { id: 20, well: "20", us: 6, gzu: 893, dns: 6177, otp: "ТП" },
  { id: 21, well: "21", us: 8, gzu: 893, dns: 6177, otp: "ТП" },
  { id: 22, well: "22", us: 7, gzu: 893, dns: 6177, otp: "ТП" },
  { id: 23, well: "23", us: 12, gzu: 893, dns: 6177, otp: "ТП" },
  { id: 24, well: "24", us: 8, gzu: 893, dns: 6177, otp: "ТП" },
  { id: 25, well: "25", us: 1, gzu: 893, dns: 6177, otp: "ТП" },
  { id: 26, well: "26", us: 5, gzu: 893, dns: 6177, otp: "ТП" },
  { id: 27, well: "27", us: 5, gzu: 893, dns: 6177, otp: "ТП" },
  { id: 28, well: "28", us: "", gzu: 693, dns: 6177, otp: "ТП" },
  { id: 29, well: "29", us: 8, gzu: 693, dns: 6177, otp: "ТП" },
  { id: 30, well: "30", us: 5, gzu: 693, dns: 6177, otp: "ТП" },
  { id: 31, well: "31", us: 6, gzu: 693, dns: 6177, otp: "ТП" },
  { id: 32, well: "32", us: 1, gzu: 693, dns: 6177, otp: "ТП" },
  { id: 33, well: "33", us: 11, gzu: 693, dns: 6177, otp: "ТП" },
  { id: 34, well: "34", us: 14, gzu: 693, dns: 6177, otp: "ТП" },
  { id: 35, well: "35", us: 1, gzu: 693, dns: 6177, otp: "ТП" },
  { id: 36, well: "36", us: 14, gzu: 693, dns: 6177, otp: "ТП" },
  { id: 37, well: "37", us: 1, gzu: 693, dns: 6177, otp: "ТП" },
  { id: 38, well: "38", us: 7, gzu: 193, dns: 9854, otp: "ТП" },
  { id: 39, well: "39", us: 12, gzu: 193, dns: 9854, otp: "ТП" },
  { id: 40, well: "40", us: 10, gzu: 193, dns: 9854, otp: "ТП" },
  { id: 41, well: "41", us: 13, gzu: 193, dns: 9854, otp: "ТП" },
  { id: 42, well: "42", us: 1, gzu: 193, dns: 9854, otp: "ТП" },
  { id: 43, well: "43", us: 12, gzu: 193, dns: 9854, otp: "ТП" },
  { id: 44, well: "44", us: 11, gzu: 193, dns: 9854, otp: "ТП" },
  { id: 45, well: "45", us: 3, gzu: 23, dns: 6177, otp: "ТП" },
  { id: 46, well: "46", us: 3, gzu: 23, dns: 6177, otp: "ТП" },
  { id: 47, well: "47", us: 13, gzu: 193, dns: 9854, otp: "ТП" },
  { id: 48, well: "48", us: 6, gzu: 203, dns: 33, otp: "ТП" },
  { id: 49, well: "49", us: 14, gzu: 33, dns: 33, otp: "ТП" },
  { id: 50, well: "50", us: 8, gzu: 33, dns: 33, otp: "ТП" },
  { id: 51, well: "51", us: 10, gzu: 33, dns: 33, otp: "ТП" },
  { id: 52, well: "52", us: 8, gzu: 203, dns: 33, otp: "ТП" },
  { id: 53, well: "53", us: 8, gzu: 203, dns: 33, otp: "ТП" },
  { id: 54, well: "54", us: 11, gzu: 203, dns: 33, otp: "ТП" },
  { id: 55, well: "55", us: 13, gzu: 203, dns: 33, otp: "ТП" },
  { id: 56, well: "56", us: 8, gzu: 33, dns: 33, otp: "ТП" },
  { id: 57, well: "57", us: 7, gzu: 103, dns: 6177, otp: "ТП" },
  { id: 58, well: "58", us: 8, gzu: 33, dns: 33, otp: "ТП" },
  { id: 59, well: "59", us: 10, gzu: 33, dns: 33, otp: "ТП" },
  { id: 60, well: "60", us: 5, gzu: 33, dns: 33, otp: "ТП" },
  { id: 61, well: "61", us: 3, gzu: 33, dns: 33, otp: "ТП" },
  { id: 62, well: "62", us: 13, gzu: 103, dns: 6177, otp: "ТП" },
  { id: 63, well: "63", us: 8, gzu: 33, dns: 33, otp: "ТП" },
  { id: 64, well: "64", us: 4, gzu: 103, dns: 6177, otp: "ТП" },
  { id: 65, well: "65", us: 9, gzu: 23, dns: 6177, otp: "ТП" },
  { id: 66, well: "66", us: 13, gzu: 23, dns: 6177, otp: "ТП" },
  { id: 67, well: "67", us: 13, gzu: 193, dns: 9854, otp: "ТП" },
  { id: 68, well: "68", us: 13, gzu: 193, dns: 9854, otp: "ТП" },
];

// Функция для добавления rowSpan для группировки
const addRowSpans = (data: OilCollectionRecord[]) => {
  const result = data.map((item) => ({ ...item }));

  // Сортируем данные для правильной группировки
  result.sort((a, b) => {
    if (a.otp !== b.otp) return a.otp.localeCompare(b.otp);
    if (a.dns !== b.dns) return a.dns - b.dns;
    if (a.gzu !== b.gzu) return a.gzu - b.gzu;
    if (a.us !== b.us) {
      // Пустые значения в конец
      if (a.us === "") return 1;
      if (b.us === "") return -1;
      return Number(a.us) - Number(b.us);
    }
    return a.id - b.id;
  });

  // Добавляем rowSpan для ОТП (ТП)
  let currentOtp = "";
  let otpStartIndex = 0;
  for (let i = 0; i < result.length; i++) {
    if (result[i].otp !== currentOtp) {
      currentOtp = result[i].otp;
      otpStartIndex = i;
    }

    const isFirstInOtpGroup = i === otpStartIndex;
    result[i].otpRowSpan = isFirstInOtpGroup
      ? result.filter((item) => item.otp === currentOtp).length
      : 0;
  }

  // Добавляем rowSpan для ДНС
  let currentDns = 0;
  let dnsStartIndex = 0;
  for (let i = 0; i < result.length; i++) {
    if (result[i].dns !== currentDns) {
      currentDns = result[i].dns;
      dnsStartIndex = i;
    }

    const isFirstInDnsGroup = i === dnsStartIndex;
    result[i].dnsRowSpan = isFirstInDnsGroup
      ? result.filter((item) => item.dns === currentDns).length
      : 0;
  }

  // Добавляем rowSpan для ГЗУ
  let currentGzu = 0;
  let gzuStartIndex = 0;
  for (let i = 0; i < result.length; i++) {
    if (result[i].gzu !== currentGzu) {
      currentGzu = result[i].gzu;
      gzuStartIndex = i;
    }

    const isFirstInGzuGroup = i === gzuStartIndex;
    result[i].gzuRowSpan = isFirstInGzuGroup
      ? result.filter((item) => item.gzu === currentGzu).length
      : 0;
  }

  // Добавляем rowSpan для Ус - ТОЛЬКО внутри одного ГЗУ
  let currentGzuForUs = 0;
  let currentUs: number | string = "";
  let usStartIndex = 0;

  for (let i = 0; i < result.length; i++) {
    // Если сменился ГЗУ, сбрасываем счетчик для Ус
    if (result[i].gzu !== currentGzuForUs) {
      currentGzuForUs = result[i].gzu;
      currentUs = result[i].us;
      usStartIndex = i;
    } else if (result[i].us !== currentUs) {
      // Если сменилось Ус внутри того же ГЗУ
      currentUs = result[i].us;
      usStartIndex = i;
    }

    // Вычисляем количество записей с таким же Ус внутри текущего ГЗУ
    let usCount = 0;
    let j = i;
    while (
      j < result.length &&
      result[j].gzu === currentGzuForUs &&
      result[j].us === currentUs
    ) {
      usCount++;
      j++;
    }

    const isFirstInUsGroup = i === usStartIndex;
    result[i].usRowSpan = isFirstInUsGroup ? usCount : 0;
  }

  return result;
};

const OilCollectionTable: React.FC = () => {
  const { selectedSchemeId } = useAppSelector((state) => state.scheme);
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const [fixed, setFixed] = React.useState(true);
  const [bordered, setBordered] = React.useState(true);
  const [expanded, setExpanded] = React.useState(false);
  const [empty, setEmpty] = React.useState(false);

  useEffect(() => {
    if (selectedSchemeId) {
      setEmpty(false);
    } else {
      setEmpty(true);
    }
  }, [selectedSchemeId]);

  useEffect(() => {
    dispatch(GetSchemes());
  }, []);

  useEffect(() => {
    if (selectedSchemeId) dispatch(setSelectedSchemeId(null));
  }, []);

  const tblRef: Parameters<typeof Table>[0]["ref"] = React.useRef(null);

  const processedData = React.useMemo(() => addRowSpans(oilCollectionData), []);

  const mergedColumns = React.useMemo<typeof fixedColumns>(() => {
    if (!fixed) {
      return columns;
    }

    if (!expanded) {
      return fixedColumns;
    }

    return fixedColumns.map((col) => ({ ...col, onCell: undefined }));
  }, [expanded, fixed]);

  const expandableProps = React.useMemo<
    TableProps<OilCollectionRecord>["expandable"]
  >(() => {
    if (!expanded) {
      return undefined;
    }

    return {
      columnWidth: 48,
      expandedRowRender: (record) => (
        <div style={{ margin: 0, padding: "10px", background: "#f5f5f5" }}>
          <p>
            <strong>Детальная информация по скважине {record.well}:</strong>
          </p>
          <p>Установка: {record.us || "Не указана"}</p>
          <p>Групповой замерный узел: {record.gzu}</p>
          <p>Дожимная насосная станция: {record.dns}</p>
          <p>Товарный парк: {record.otp}</p>
        </div>
      ),
      rowExpandable: (record) => record.us !== "",
    };
  }, [expanded]);

  function OnCancel() {
    dispatch(GetSchemes());
    setOpen(false);
  }

  return (
    <>
      <Row>
        <Col style={{ paddingInline: 20 }}>
          <Space direction="vertical" style={{ width: "100%" }}>
            <Space
              direction="horizontal"
              style={{ width: "100%", justifyContent: "space-between" }}
            >
              <Button
                icon={<UploadOutlined />}
                onClick={() => {
                  setOpen(true);
                }}
              >
                Импорт схемы
              </Button>

              <MainPanel />
            </Space>

            {/* <Space>
          <Switch
            checked={bordered}
            onChange={() => setBordered(!bordered)}
            checkedChildren="Границы"
            unCheckedChildren="Границы"
          />
          <Switch
            checked={fixed}
            onChange={() => setFixed(!fixed)}
            checkedChildren="Фикс. колонки"
            unCheckedChildren="Фикс. колонки"
          />
          <Switch
            checked={expanded}
            onChange={() => setExpanded(!expanded)}
            checkedChildren="Расширение"
            unCheckedChildren="Расширение"
          />
          <Switch
            checked={empty}
            onChange={() => setEmpty(!empty)}
            checkedChildren="Пусто"
            unCheckedChildren="Пусто"
          />
        </Space> */}
            <Table<OilCollectionRecord>
              size="small"
              bordered={bordered}
              virtual
              columns={mergedColumns}
              scroll={{ x: 800, y: 600 }}
              rowKey="id"
              dataSource={empty ? [] : processedData}
              pagination={false}
              ref={tblRef}
              // rowSelection={
              //   expanded ? undefined : { type: "checkbox", columnWidth: 48 }
              // }
              expandable={expandableProps}
              // summary={() => (
              //   <Table.Summary>
              //     <Table.Summary.Row>
              //       <Table.Summary.Cell index={0} colSpan={2}>
              //         <strong>Итого скважин:</strong>
              //       </Table.Summary.Cell>
              //       <Table.Summary.Cell index={1}>
              //         <strong>{processedData.length}</strong>
              //       </Table.Summary.Cell>
              //       <Table.Summary.Cell index={2} colSpan={3}>
              //         <strong>Система сбора нефти</strong>
              //       </Table.Summary.Cell>
              //     </Table.Summary.Row>
              //   </Table.Summary>
              // )}
            />
          </Space>
        </Col>
      </Row>
      <ImportSchemeModal open={open} onCancel={OnCancel} />
    </>
  );
};

export default OilCollectionTable;

function MainPanel() {
  const { selectedSchemeId, schemes } = useAppSelector((state) => state.scheme);
  const dispatch = useAppDispatch();
  const [schemeValues, setSchemeValues] = useState<
    { value: number; label: string }[]
  >([]);

  //Запросы на WebAPI
  useEffect(() => {
    const getSch = async () => {
      if (schemes.length > 0) {
        const schemesOptions = schemes.map((scheme: Scheme) => ({
          value: scheme.scheme_id,
          label: scheme.name,
        }));
        setSchemeValues(schemesOptions);
        // if (!selectedSchemeId && schemesOptions.length > 0) {
        //   //setSelectedSchemeId(schemesOptions[0].value);
        //   dispatch(setSelectedSchemeId(schemesOptions[0].value));
        // }
      }
    };
    getSch();
  }, [schemes]);

  return (
    <>
      <Space style={{ width: "100%", marginLeft: 10, marginRight: 10 }}>
        <Select
          style={{ width: "250px" }}
          placeholder="Выберите схему..."
          value={selectedSchemeId}
          options={schemeValues}
          onChange={(value, option) => {
            console.log(value);
            dispatch(setSelectedSchemeId(value));
          }}
          dropdownRender={(menu) => (
            <>
              <div style={{ padding: "8px 12px", fontWeight: "bold" }}>
                Схема Сбора
              </div>
              <Divider style={{ margin: "4px 0" }} />
              {menu}
            </>
          )}
        />
      </Space>
    </>
  );
}
