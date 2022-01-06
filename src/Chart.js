import React, { useState, useEffect } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Title,
    Legend
} from "chart.js";
import { Line } from "react-chartjs-2";
import { dataNew } from './data';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

export default function Chart() {
    const [filterData, setFilterData] = useState(dataNew);
    const [dateCounter,setDateCounter] = useState(1);
    const slot =["1992-05-02","1998-02-03","2004-09-21","2009-02-10","2022-04-01"];
    const [timeOutVar ,setTimeOutVar] = useState(0);
    
    const dataSlicer=(counter,dataSlot,data)=>{
        let startDate = new Date(dataSlot[0]).getTime();
        let endDate = new Date(dataSlot[counter]).getTime();

        if(startDate && endDate){
            let findData = data.filter((item)=>{
                let itemDate = new Date(item.Date).getTime();
                if(itemDate >= startDate && itemDate <= endDate){
                    return true;
                }else{
                    return false;
                }
            })            
            return findData;
        }else{
            return [];
        }
    }

    const [newData, setNewData] = useState(dataSlicer(dateCounter,slot,filterData));
    function dataFilterTimeout(){
        let localCounter = dateCounter+1;
        setTimeOutVar(setInterval(() => { 
            let data = dataSlicer(localCounter,slot,filterData); 
            let filteredData = data.length?data:newData;
            console.log("filtered",filteredData);
            setNewData(filteredData);
            setDateCounter(localCounter++);
        }, 900000));
      }

    useEffect(()=>{
        if(dateCounter >= slot.length-1 && timeOutVar){
            clearInterval(timeOutVar);
        }
        if (dateCounter === 1){
            dataFilterTimeout();
        }    
    },[dateCounter]);

    const options = {
        responsive: true,
        plugins: {
          legend: {
          },
          title: {
            display: true,
            text: "Chart.js Line Chart"
          }
        }
      };
      const labels = newData.map((data) => {
        return data.Date;
      });
      
       const data = {
        labels,
        datasets: [
          {
            label: "Volume",
            data: newData.map((data) => {
              return data.Volume;
            }),
            borderColor: "rgb(255, 99, 132)",
            backgroundColor: "rgba(255, 99, 132, 0.5)"
          },
          {
            label: "Adj Close",
            data: newData.map((data) => {
              return data["Adj Close"];
            }),
            borderColor: 'rgba(54, 162, 235, 1)',
            backgroundColor: 'rgba(54, 162, 235, 1)',
          }
        ],
      };

      return (<>
      <h2>Date Span From {slot[0]} To {slot[dateCounter]}</h2>
      <Line options={options} data={data} />
       
      </>);

}