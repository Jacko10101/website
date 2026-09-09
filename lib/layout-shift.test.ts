import { describe, expect, it } from "vitest";
import { createLayoutShiftAccumulator } from "./layout-shift";

describe("local layout-shift estimate", () => {
  it("keeps the largest burst instead of summing a long-lived document", () => {
    const add = createLayoutShiftAccumulator();
    expect(add({startTime:100,value:.08,hadRecentInput:false})).toBe(.08);
    expect(add({startTime:600,value:.04,hadRecentInput:false})).toBeCloseTo(.12);
    expect(add({startTime:2000,value:.07,hadRecentInput:false})).toBeCloseTo(.12);
    expect(add({startTime:2400,value:.5,hadRecentInput:true})).toBeCloseTo(.12);
  });
  it("caps a continuous burst at five seconds", () => {
    const add = createLayoutShiftAccumulator();
    for(let time=0;time<5000;time+=500) add({startTime:time,value:.01,hadRecentInput:false});
    expect(add({startTime:5000,value:.02,hadRecentInput:false})).toBeCloseTo(.1);
  });
});
