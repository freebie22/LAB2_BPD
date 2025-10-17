"use client";

import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const OPERATION_TYPES = {
  SUM: "+",
  SUB: "-",
  NEG: "-a",
  MUL: "*",
  POW: "^",
};

const Calculator = () => {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [m, setM] = useState("");
  const [result, setResult] = useState("");

  const add = (a, b, m) => {
    return (Number(a) + Number(b)) % Number(m);
  };

  const negate = (a, m) => {
    return (Number(m) - Number(a)) % Number(m);
  };

  const subtract = (a, b, m) => {
    return (Number(a) - Number(b) + Number(m)) % Number(m);
  };

  const multiply = (a, b, m) => {
    return (Number(a) * Number(b)) % Number(m);
  };

  const power = (a, b, m) => {
    let result = 1;
    a = Number(a) % Number(m);
    b = Number(b);

    while (b > 0) {
      if ((b & 1) === 1) {
        result = (result * a) % Number(m);
      }
      a = (a * a) % Number(m);
      b >>= 1;
    }
    return result;
  };

  const calculateResult = (operationType) => {
    switch (operationType) {
      case OPERATION_TYPES.SUM:
        console.log(add(a, b, m));
        setResult(add(a, b, m));
        break;
      case OPERATION_TYPES.SUB:
        setResult(subtract(a, b, m));
        break;
      case OPERATION_TYPES.NEG:
        setResult(negate(a, m));
        break;
      case OPERATION_TYPES.MUL:
        setResult(multiply(a, b, m));
        break;
      case OPERATION_TYPES.POW:
        setResult(power(a, b, m));
        break;
    }
  };

  const clearResult = () => {
    setA("");
    setB("");
    setM("");
    setResult("");
  };

  return (
    <div className="container px-5 py-10 mx-auto">
      <div className="flex flex-col justify-center text-center">
        <h3 className={"text-2xl"}>
          {" "}
          Калькулятор для розрахунку груп класів залишків за модулем
        </h3>
      </div>

      <div className="flex justify-center gap-24">
        <div className="flex flex-col mt-8">
          <div className="flex flex-col items-center justify-center">
            <Label className={"py-4"}>Число а</Label>
            <Input
              className={
                "w-[210px] [&::-webkit-inner-spin-button]:appearance-none cursor-pointer mb-3"
              }
              value={a}
              onChange={(event) => setA(event.target.value)}
              type="number"
              placeholder="Введіть число а..."
            />
          </div>
          <div className="flex flex-col items-center justify-center">
            <Label className={"py-4"}>Число b</Label>
            <Input
              className={
                "w-[210px] [&::-webkit-inner-spin-button]:appearance-none cursor-pointer mb-3"
              }
              type="number"
              value={b}
              onChange={(event) => setB(event.target.value)}
              placeholder="Введіть число b..."
            />
          </div>
          <div className="flex flex-col items-center justify-center">
            <Label className={"py-4"}>Число m</Label>
            <Input
              className={
                "w-[210px] [&::-webkit-inner-spin-button]:appearance-none cursor-pointer mb-3"
              }
              type="number"
              value={m}
              onChange={(event) => setM(event.target.value)}
              placeholder="Введіть число m..."
            />
          </div>

          {result !== "" && (
            <div className="flex justify-center my-4">
              <p>
                Результат ={" "}
                <span className="underline underline-offset-4">{result}</span>
              </p>
            </div>
          )}

          <div className="grid grid-cols-3 gap-5">
            <Button
              onClick={() => calculateResult(OPERATION_TYPES.SUM)}
              className={"mt-5  bg-[#FF9200] text-white cursor-pointer"}
              type="button"
            >
              +
            </Button>
            <Button
              onClick={() => calculateResult(OPERATION_TYPES.SUB)}
              className={"mt-5 bg-[#FF9200] text-white cursor-pointer"}
              type="button"
            >
              -
            </Button>
            <Button
              onClick={() => calculateResult(OPERATION_TYPES.NEG)}
              className={"mt-5 bg-[#FF9200] text-white cursor-pointer"}
              type="button"
            >
              -a
            </Button>
            <Button
              onClick={() => calculateResult(OPERATION_TYPES.MUL)}
              className={"mt-5 bg-[#FF9200] text-white cursor-pointer"}
              type="button"
            >
              *
            </Button>
            <Button
              onClick={() => calculateResult(OPERATION_TYPES.POW)}
              className={"mt-5 bg-[#FF9200] text-white cursor-pointer"}
              type="button"
            >
              ^
            </Button>
            <Button
              onClick={() => clearResult()}
              className={"mt-5 cursor-pointer text-white bg-[#5B5B5B]"}
              type="button"
            >
              Очистити
            </Button>
            <Button
              variant={"outline"}
              className={"mt-5 cursor-not-allowed"}
              type="button"
              disabled
            >
              /
            </Button>
            <Button
              variant={"outline"}
              className={"mt-5 cursor-not-allowed"}
              type="button"
              disabled
            >
              1/a
            </Button>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center text-center mt-16">
        <h3 className={"text-xl"}>
          {" "}
          Розробив студент групи Бст-121-23-5-Пі <br /> Бойков Артем Дмитрович
        </h3>
      </div>
    </div>
  );
};

export default Calculator;
