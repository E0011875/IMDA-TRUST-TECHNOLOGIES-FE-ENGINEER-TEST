import * as React from 'react';
import { FilterSelectProps } from './typings';
import styles from './style.module.css';
import { Button, Checkbox } from 'antd';

const FilterSelect: React.FC<FilterSelectProps> = ({
  options,
  value,
  onClear,
  onConfirm,
}) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [currentValue, setCurrentValue] = React.useState<string[]>([]);
  React.useEffect(() => {
    setCurrentValue(value || []);
  }, [value]);
  return (
    <div className={styles.container} ref={ref}>
      <Checkbox.Group
        value={currentValue}
        options={options}
        onChange={(selection) => setCurrentValue(selection as string[])}
        className={styles.filters}
      />
      <div className={styles.actions}>
        {options.length > 1 && (
          <Button size="small" onClick={onClear}>
            Reset
          </Button>
        )}
        <Button
          type="primary"
          size="small"
          onClick={() => onConfirm(currentValue)}
        >
          Confirm
        </Button>
      </div>
    </div>
  );
};

export default FilterSelect;
