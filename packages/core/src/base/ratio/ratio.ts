import { Input, number, minValue, maxValue } from "valibot";

export const ratioSchema = number([minValue(0), maxValue(1)])
export type Ratio = Input<typeof ratioSchema>
