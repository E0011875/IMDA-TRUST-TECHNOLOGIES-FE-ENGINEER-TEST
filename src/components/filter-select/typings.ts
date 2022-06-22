export type FilterSelectProps = {
  options: {
    label: string;
    value: string;
  }[];
  value?: string[];
  onClear: () => void;
  onConfirm: (values: string[] | string) => void;
};
