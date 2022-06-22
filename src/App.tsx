import * as React from 'react';
import { Input, InputRef, Table } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { FilterOutlined, SearchOutlined } from '@ant-design/icons';
import FilterSelect from './components/filter-select';
import debounce from 'lodash/debounce';
import { Phase, Threat, THREAT_TYPE } from './typings';
import styles from './App.module.css';
import { objects } from './data.json';

const App: React.FC = () => {
  const [searchParams, setSearchParams] = React.useState<Record<string, any>>(
    {}
  );
  const [data, setData] = React.useState<Threat[]>([]);
  React.useEffect(() => {
    setData(
      (objects as Threat[]).filter((threat) =>
        Object.entries(searchParams).every(([key, value]) => {
          const target = threat[key]?.toString().toLowerCase();
          const comparator = value.toString().toLowerCase();
          const [shorter, longer] =
            target.length < comparator.length
              ? [target, comparator]
              : [comparator, target];
          return longer.includes(shorter);
        })
      )
    );
  }, [searchParams]);
  const searchInput = React.useRef<InputRef>(null);
  const getColumnSearchProps = React.useCallback(
    (dataIndex: string) =>
      ({
        filterDropdown: () => (
          <Input.Search
            ref={searchInput}
            defaultValue={searchParams[dataIndex]}
            placeholder={`Search ${dataIndex}`}
            onChange={(event) =>
              debounce(
                (value) =>
                  setSearchParams(
                    ({ [dataIndex]: searchParam, ...params }) => ({
                      ...params,
                      ...(value ? { [dataIndex]: value } : {}),
                    })
                  ),
                500
              )(event.target.value)
            }
            allowClear={true}
            addonBefore={<SearchOutlined />}
            className={styles.search}
          />
        ),
        onFilterDropdownVisibleChange: (visible: boolean) =>
          visible ? setTimeout(() => searchInput.current?.select(), 100) : null,
        filterIcon: (
          <SearchOutlined
            style={{
              color: Boolean(searchParams[dataIndex]) ? '#1890ff' : undefined,
            }}
          />
        ),
      } as ColumnProps<Threat>),
    [searchParams]
  );
  const columns: ColumnProps<Threat>[] = React.useMemo(
    () => [
      {
        title: 'Type',
        dataIndex: 'type',
        render: (type: string) => type || '-',

        filterDropdown: () => (
          <FilterSelect
            options={Object.values(THREAT_TYPE).map((value: string) => ({
              label: value.charAt(0).toUpperCase() + value.slice(1),
              value,
            }))}
            value={searchParams.type}
            onClear={() => setSearchParams(({ type, ...params }) => params)}
            onConfirm={(values) =>
              setSearchParams(({ type, ...params }) => ({
                ...params,
                ...(values.length ? { type: values } : {}),
              }))
            }
          />
        ),
        filterIcon: (
          <FilterOutlined
            style={{
              color: Boolean(searchParams.type) ? '#1890ff' : undefined,
            }}
          />
        ),
      },
      {
        title: 'Name',
        dataIndex: 'name',
        render: (name: string) => name || '-',
        ...getColumnSearchProps('name'),
      },
      {
        title: 'Description',
        dataIndex: 'description',
        ellipsis: true,
        render: (description: string) => description || '-',
        ...getColumnSearchProps('description'),
      },
      {
        title: 'Kill Chain Phases',
        dataIndex: 'kill_chain_phases',
        render: (phases?: Phase[]) =>
          phases ? (
            <div className={styles.phases}>
              {phases?.map(({ kill_chain_name, phase_name }, index) => (
                <>
                  <div className={styles.phases__info}>
                    <div>{phase_name}</div>
                    <div>{kill_chain_name}</div>
                  </div>
                  {index < phases.length - 1 && (
                    <div className={styles.phases__next}>&#62;</div>
                  )}
                </>
              ))}
            </div>
          ) : (
            '-'
          ),
      },
    ],
    [getColumnSearchProps, searchParams.type]
  );
  return (
    <div className={styles.App}>
      <img className={styles.logo} alt="IMDA" />
      <Table
        dataSource={data}
        columns={columns}
        rowKey="id"
        pagination={{
          size: 'small',
          defaultPageSize: 10,
          showSizeChanger: false,
          showTotal: (total) => `Total ${total} results`,
        }}
      />
      <div className={styles.footer}>
        Developed by Leslie Ho Zong Hong on 21 Jun, 2022.
      </div>
    </div>
  );
};

export default App;
