"use client"
import axios from "axios";
import Spreadsheet from "./Spreadsheet";
import { useEffect } from "react";

export default function Page() {

  const call=async()=>{
    const data=await axios.get("https://reactspreadsheetnode.onrender.com");

  }
  useEffect(()=>{call()},[])
  return (
    <main>
      <Spreadsheet />
    </main>
  );
}
