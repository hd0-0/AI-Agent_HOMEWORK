import { z } from "zod";
import { defineTool } from "../utils/func-tool.js";

async function convert_unit({ value, from_unit, to_unit }) {
  if ((from_unit="度C") & (to_unit="度F")) {
    return {
      value: value*9/5 + 32,
      to_unit: to_unit,
      description: "進⾏單位換算",
  };
  }
  else if ((from_unit="度F") & (to_unit="度C")) {
    return {
      value: (value-32)*5/9,
      to_unit: to_unit,
      description: "進⾏單位換算",
  };
  }
  else if ((from_unit="公⾥") & (to_unit="英⾥")) {
    return {
      value: value*0.621371,
      to_unit: to_unit,
      description: "進⾏單位換算",
  };
  }
  else if ((from_unit="英⾥") & (to_unit="公⾥")) {
    return {
      value: value/0.621371,
      to_unit: to_unit,
      description: "進⾏單位換算",
  };
  }
  else if ((from_unit="公⽄") & (to_unit="磅")) {
    return {
      value: value*2.20462,
      to_unit: to_unit,
      description: "進⾏單位換算",
  };
  }
  else if ((from_unit="磅") & (to_unit="公⽄")) {
    return {
      value: value/2.20462,
      to_unit: to_unit,
      description: "進⾏單位換算",
  };
  }
  else {
    return {
      error:"不⽀援的單位組合",
  };
  }

}

export const convert_unitTool = defineTool({
  name: "convert_unit",
  description: "進⾏單位換算,由提供的value（數字，如 25）、from_unit（字串，原始單位）、 to_unit（字串，⽬標單位),藉由工具進行單位轉換。",
  fn: convert_unit,
  pparameters: z.object({
    value: z.number().describe("數字，如:25"),
    from_unit: z.string().describe("原始單位，如:度F"),
    to_unit: z.string().describe("⽬標單位，如:度C"),
  }),
});