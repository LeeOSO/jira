import { Select } from "antd";
import React from "react";
import { Raw } from "../types";

type SelectProps = React.ComponentProps<typeof Select>; //获取Select所有的Props的类型

interface IdSelectProps
  extends Omit<SelectProps, "value" | "onChange" | "options"> {
  //继承组件所有Props类型并移除同名类型
  value?: Raw | null | undefined;
  onChange?: (value?: number) => void;
  defaultOptionName?: string;
  options?: { name: string; id: number }[];
}

/**
 * value可以传入多种类型，代表默认选择的Option
 * onChange只会回调 number|undefined 类型
 * 当 isNaN(Number(value)) 为true的时候，代表选择默认Option
 * 当选择默认Option时，onChange回调undefined
 *
 * @param props
 * @constructor
 */
export const IdSelect = (props: IdSelectProps) => {
  const { value, onChange, defaultOptionName, options, ...restProps } = props;
  return (
    <Select
      // value:当options未加载出来时，设置默认值为0匹配'负责人'选项
      value={options?.length ? toNumber(value) : 0}
      onChange={(value) => onChange?.(toNumber(value) || undefined)}
      {...restProps}
    >
      {defaultOptionName ? (
        <Select.Option value={0}>{defaultOptionName}</Select.Option>
      ) : null}
      {options?.map((option) => (
        <Select.Option value={option.id} key={option.id}>
          {option.name}
        </Select.Option>
      ))}
    </Select>
  );
};

const toNumber = (value: unknown) => (isNaN(Number(value)) ? 0 : Number(value));
