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
  PRIME_CHECK: "primeCheck",
  PRIME_GEN: "primeGen",
  GCD: "gcd",
  EULER_PHI: "eulerPhi",
  INV_EULER: "invEuler", // нова операція — обернений через функцію Ейлера
};

const modPow = (base, exp, mod) => {
  base = Number(base);
  exp = Number(exp);
  mod = Number(mod);
  if (mod === 1) return 0;
  let result = 1;
  base = ((base % mod) + mod) % mod;
  while (exp > 0) {
    if (exp & 1) result = (result * base) % mod;
    base = (base * base) % mod;
    exp >>= 1;
  }
  return result;
};

const gcd = (a, b) => {
  a = Math.abs(Number(a));
  b = Math.abs(Number(b));
  while (b !== 0) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
};

// Обчислення функції Ейлера через розклад на прості множники
const eulerPhi = (nInput) => {
  let n = Math.floor(Number(nInput));
  if (Number.isNaN(n) || n < 1) return null;
  let result = n;
  let temp = n;

  for (let i = 2; i * i <= temp; i++) {
    if (temp % i === 0) {
      while (temp % i === 0) temp = Math.floor(temp / i);
      result -= Math.floor(result / i);
    }
  }
  if (temp > 1) result -= Math.floor(result / temp);
  return result;
};

// Примітивна перевірка на простоту (необов'язково використовується тут)
const isProbablePrime = (p, iterations = 5) => {
  p = Number(p);
  if (p <= 1) return false;
  if (p <= 3) return true;
  if (p % 2 === 0) return false;
  for (let i = 0; i < iterations; i++) {
    const a = 2 + Math.floor(Math.random() * (p - 3));
    if (modPow(a, p - 1, p) !== 1) return false;
  }
  return true;
};

const generatePrime = (A) => {
  A = Number(A);
  if (A < 2) return null;
  let p;
  do {
    p = 2 + Math.floor(Math.random() * (A - 1));
  } while (!isProbablePrime(p));
  return p;
};

const Calculator = () => {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [m, setM] = useState("");
  const [result, setResult] = useState("");

  const add = (a, b, m) => (Number(a) + Number(b)) % Number(m);
  const negate = (a, m) => (Number(m) - Number(a)) % Number(m);
  const subtract = (a, b, m) => (Number(a) - Number(b) + Number(m)) % Number(m);
  const multiply = (a, b, m) => (Number(a) * Number(b)) % Number(m);
  const power = (a, b, m) => modPow(Number(a), Number(b), Number(m));

  const calculateResult = (operationType) => {
    switch (operationType) {
      case OPERATION_TYPES.SUM:
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
      case OPERATION_TYPES.PRIME_CHECK: {
        const isPrime = isProbablePrime(a);
        setResult(isPrime ? `${a} — просте число` : `${a} — не просте число`);
        break;
      }
      case OPERATION_TYPES.PRIME_GEN: {
        const prime = generatePrime(m);
        setResult(
          prime
            ? `Згенероване просте число: ${prime}`
            : "Не вдалося знайти просте число"
        );
        break;
      }
      case OPERATION_TYPES.GCD: {
        const g = gcd(a, b);
        const coprime =
          g === 1
            ? "Числа є взаємно простими ✅"
            : "Числа не є взаємно простими ❌";
        setResult(`НОД(${a}, ${b}) = ${g}. ${coprime}`);
        break;
      }
      case OPERATION_TYPES.EULER_PHI: {
        const phi = eulerPhi(a);
        setResult(phi === null ? "Невірний аргумент" : `ϕ(${a}) = ${phi}`);
        break;
      }
      case OPERATION_TYPES.INV_EULER: {
        const p = Math.floor(Number(m));
        const ai = Number(a);

        if (Number.isNaN(p) || p < 2) {
          setResult("Невірний модуль p (введіть p ≥ 2)");
          break;
        }
        if (Number.isNaN(ai)) {
          setResult("Невірний аргумент a");
          break;
        }
        if (gcd(ai, p) !== 1) {
          setResult(`gcd(${a}, ${p}) ≠ 1 — оберненого елемента не існує`);
          break;
        }

        const phiP = eulerPhi(p);
        if (phiP === null) {
          setResult("Не вдалося обчислити ϕ(p)");
          break;
        }
        // a^{-1} ≡ a^{ϕ(p)-1} (mod p)
        const exponent = Number(phiP) - 1;
        const inv = modPow(ai, exponent, p);
        setResult(
          `a^{-1} ≡ ${inv} (mod ${p}). Перевірка: ${ai}*${inv} mod ${p} = ${
            (ai * inv) % p
          }`
        );
        break;
      }
      default:
        setResult("Невідома операція");
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
        <h3 className="text-2xl">
          Калькулятор для розрахунку груп класів залишків за модулем
        </h3>
      </div>

      <div className="flex justify-center gap-24">
        <div className="flex flex-col mt-8">
          <div className="flex flex-col items-center justify-center">
            <Label className="py-4">Число a</Label>
            <Input
              className="w-[210px] [&::-webkit-inner-spin-button]:appearance-none cursor-pointer mb-3"
              value={a}
              onChange={(event) => setA(event.target.value)}
              type="number"
              placeholder="Введіть число a..."
            />
          </div>
          <div className="flex flex-col items-center justify-center">
            <Label className="py-4">Число b</Label>
            <Input
              className="w-[210px] [&::-webkit-inner-spin-button]:appearance-none cursor-pointer mb-3"
              type="number"
              value={b}
              onChange={(event) => setB(event.target.value)}
              placeholder="Введіть число b..."
            />
          </div>
          <div className="flex flex-col items-center justify-center">
            <Label className="py-4">Модуль p (вводиться в поле m)</Label>
            <Input
              className="w-[210px] [&::-webkit-inner-spin-button]:appearance-none cursor-pointer mb-3"
              type="number"
              value={m}
              onChange={(event) => setM(event.target.value)}
              placeholder="Введіть модуль p..."
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
              className="mt-5 bg-[#FF9200] text-white"
            >
              +
            </Button>
            <Button
              onClick={() => calculateResult(OPERATION_TYPES.SUB)}
              className="mt-5 bg-[#FF9200] text-white"
            >
              -
            </Button>
            <Button
              onClick={() => calculateResult(OPERATION_TYPES.NEG)}
              className="mt-5 bg-[#FF9200] text-white"
            >
              -a
            </Button>
            <Button
              onClick={() => calculateResult(OPERATION_TYPES.MUL)}
              className="mt-5 bg-[#FF9200] text-white"
            >
              *
            </Button>
            <Button
              onClick={() => calculateResult(OPERATION_TYPES.POW)}
              className="mt-5 bg-[#FF9200] text-white"
            >
              ^
            </Button>
            <Button
              onClick={() => clearResult()}
              className="mt-5 text-white bg-[#5B5B5B]"
            >
              Очистити
            </Button>

            <Button
              onClick={() => calculateResult(OPERATION_TYPES.PRIME_CHECK)}
              className="mt-5 bg-[#FF9200] text-white"
            >
              Перевірити простоту
            </Button>
            <Button
              onClick={() => calculateResult(OPERATION_TYPES.PRIME_GEN)}
              className="mt-5 bg-[#FF9200] text-white"
            >
              Згенерувати просте
            </Button>
            <Button
              onClick={() => calculateResult(OPERATION_TYPES.GCD)}
              className="mt-5 bg-[#FF9200] text-white"
            >
              НОД
            </Button>

            <Button
              onClick={() => calculateResult(OPERATION_TYPES.EULER_PHI)}
              className="mt-5 bg-[#FF9200] text-white"
            >
              Функція Ейлера
            </Button>
            <Button
              onClick={() => calculateResult(OPERATION_TYPES.INV_EULER)}
              className="mt-5 bg-[#FF9200] text-white"
            >
              a⁻¹ (Euler)
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-center text-center mt-16">
        <h3 className="text-xl">
          Розробив студент групи Бст-121-23-5-Пі <br /> Бойков Артем Дмитрович
        </h3>
      </div>
    </div>
  );
};

export default Calculator;
