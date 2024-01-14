import { Chart } from "primereact/chart";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useContext, useEffect, useRef, useState } from "react";
import { ProductService } from "../demo/service/ProductService";
import { LayoutContext } from "../layout/context/layoutcontext";
import { Toast } from "primereact/toast";
import { useRouter } from "next/router";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";
import axiosInterceptorInstance from "../demo/components/axios";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";


const Dashboard = () => {
  const [products, setProducts] = useState(null);
  const [lineOptions, setLineOptions] = useState(null);
  const { layoutConfig } = useContext(LayoutContext);
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  const [chartData2, setChartData2] = useState({});
  const [chartOptions2, setChartOptions2] = useState({});

  const [chartbarPaymentData, setChartPaymentbarData] = useState({});
  const [chartbarPaymentOptions, setChartbarPaymentOptions] = useState({});

  const [chartbarWithdrawData, setChartbarWithdrawData] = useState({});
  const [chartbarWithdrawOptions, setChartbarWithdrawOptions] = useState({});
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [loanAmountCurrency, setLoanAmountCurrency] = useState([]);
  const [loanAmountPayment, setLoanAmountPayment] = useState([]);
  const [loanAmountBalance, setLoanAmountBalance] = useState([]);
  const [showTotalLoan, setShowTotalLoan] = useState(null);
  const [showTotalPaymentLoan, setShowTotalPaymentLoan] = useState(null);
  const [showTotalBalanceLoan, setShowTotalBalanceLoan] = useState(null);
  const [city, setCity] = useState(null);
  

  useEffect(() => {
    checkAuthorization();
    showLoanAmountCurrency();
    showLoanAmountPayment();
    showLoanAmountBalance();
  }, []);

  const checkAuthorization = () => {
    try {
      var access_Token = localStorage.getItem("token");

      console.log("Token ===>", access_Token);

      if (!access_Token) {
        setAuthorized(false);
        router.replace("/auth/login");
      } else {
        setAuthorized(true);
        router.replace("/");
        // headersData = localStorage.getItem('userName');
        // token = headersData.access_token;
      }
    } catch (error) {
      console.error(error);
      toast.current.show({
        severity: "error",
        summary: "ຜິດພາດ",
        detail: "Authorization has been denied",
      });
      router.push("/auth/login");
    }
  };
  const showLoanAmountCurrency = async () => {
    try {
      const response = await axiosInterceptorInstance.get(
        "/api/loan/GetListLoanCurrency"
      );

      if (response.status === 200 || response.status === 201) {
        setLoanAmountCurrency(response.data);
      }
    } catch (error) {
      console.error(error);
      toast.current.show({
        severity: "error",
        summary: "ຜິດພາດ",
        detail: "Authorization has been denied",
      });
      localStorage.removeItem("token");
      localStorage.removeItem("userName");
    //   router.push("/auth/login");
    }
  };

  const showLoanAmountPayment = async () => {
    try {
      const response = await axiosInterceptorInstance.get(
        "/api/loan/GetlistLoanPayment"
      );

      if (response.status === 200 || response.status === 201) {
        setLoanAmountPayment(response.data);
      }
    } catch (error) {
      console.error(error);
      toast.current.show({
        severity: "error",
        summary: "ຜິດພາດ",
        detail: "Authorization has been denied",
      });
      localStorage.removeItem("token");
      localStorage.removeItem("userName");
    //   router.push("/auth/login");
    }
  };

  const showLoanAmountBalance = async () => {
    try {
      const response = await axiosInterceptorInstance.get(
        "/api/loan/GetlistLoanBalance"
      );

      if (response.status === 200 || response.status === 201) {
        setLoanAmountBalance(response.data);
      }
    } catch (error) {
      console.error(error);
      toast.current.show({
        severity: "error",
        summary: "ຜິດພາດ",
        detail: "Authorization has been denied",
      });
      localStorage.removeItem("token");
      localStorage.removeItem("userName");
    //   router.push("/auth/login");
    }
  };


  useEffect(() => {
    const documentStyle = getComputedStyle(document.documentElement);
    const data = {
      labels: ["ໜີ້ກູ້ຢືມໂດຍກົງ", "ໜີ້ກູ້ຢືມຕໍ່", "ໜີ້ກູ້ຢືມແກ້ສະພາບຄ່ອງ"],
      datasets: [
        {
          data: [500000000,100000000, 500000000],
          backgroundColor: [
            documentStyle.getPropertyValue("--red-400"),
            documentStyle.getPropertyValue("--orange-400"),
            documentStyle.getPropertyValue("--yellow-400"),
          ],
          hoverBackgroundColor: [
            documentStyle.getPropertyValue("--red-300"),
            documentStyle.getPropertyValue("--orange-300"),
            documentStyle.getPropertyValue("--yellow-300"),
          ],
              
        },
      ],
    };
    const options = {
      cutout: "50%",
    };

    setChartData(data);
    setChartOptions(options);
  }, []);


  useEffect(() => {
    const documentStyle = getComputedStyle(document.documentElement);
    const data = {
        labels: ['2014','2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022','2023'],
        datasets: [
            {
                label: 'ຊຳລະໜີ້',
                data: [540, 325, 702, 620,540, 325, 702, 620,540, 325],
                backgroundColor: [
                  documentStyle.getPropertyValue("--green-400"),              
                ],
                hoverBackgroundColor: [
                  documentStyle.getPropertyValue("--green-300"),                
                ],      
            }
        ]
    };
    const options = {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    };

    setChartPaymentbarData(data);
    setChartbarPaymentOptions(options);
}, []);

useEffect(() => {
  const documentStyle = getComputedStyle(document.documentElement);
  const data = {
      labels: ['2014','2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022','2023'],
      datasets: [
          {
              label: 'ກູ້ຢືມໜີ້',
              data: [540, 325, 702, 620,540, 325, 702, 620,540, 325],
              backgroundColor: [
                documentStyle.getPropertyValue("--red-400")     
              ],
              hoverBackgroundColor: [
                documentStyle.getPropertyValue("--red-300")    
              ],     
          }
      ]
  };
  const options = {
      scales: {
          y: {
              beginAtZero: true
          }
      }
  };

  setChartbarWithdrawData(data);
  setChartbarWithdrawOptions(options);
}, []);

useEffect(() => {
  const documentStyle = getComputedStyle(document.documentElement);
  const textColor = documentStyle.getPropertyValue('--text-color');
  const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
  const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
  const data = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
          {
              label: 'ກູ້ຢືມໜີ້',
              backgroundColor: documentStyle.getPropertyValue('--red-400'),
              borderColor: documentStyle.getPropertyValue('--red-400'),
              data: [65, 59, 80, 81, 56, 55, 40]
          }
       
      ]
  };
  const options = {
      indexAxis: 'y',
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
          legend: {
              labels: {
                  fontColor: textColor
              }
          }
      },
      scales: {
          x: {
              ticks: {
                  color: textColorSecondary,
                  font: {
                      weight: 500
                  }
              },
              grid: {
                  display: false,
                  drawBorder: false
              }
          },
          y: {
              ticks: {
                  color: textColorSecondary
              },
              grid: {
                  color: surfaceBorder,
                  drawBorder: false
              }
          }
      }
  };

  setChartData2(data)
  setChartOptions2(options);
}, []);



  useEffect(() => {
    ProductService.getProductsSmall().then((data) => setProducts(data));
  }, []);

  const formatCurrency = (value) => {
    return value.toLocaleString("en-US", {});
  };

  const amountcurrencyBody = (rowData) => {
    return formatCurrency(rowData.amount_currency);
  };

  const rateBody = (rowData) => {
    return formatCurrency(rowData.rate);
  };

  const amountkipBody = (rowData) => {
    return formatCurrency(rowData.amount_kip);
  };

  const amountcurrencyPaymentBody = (rowData) => {
    return formatCurrency(rowData.amount_currency);
  };

  const ratePaymentBody = (rowData) => {
    return formatCurrency(rowData.rate);
  };

  const amountkipPaymentBody = (rowData) => {
    return formatCurrency(rowData.amount_kip);
  };

  const amountcurrencyBalanceBody = (rowData) => {
    return formatCurrency(rowData.amount_currency);
  };

  const rateBalanceBody = (rowData) => {
    return formatCurrency(rowData.rate);
  };

  const amountkipBalancetBody = (rowData) => {
    return formatCurrency(rowData.amount_kip);
  };

  const totalLoan = () => {
    let total = 0;
    for (let total_loan of loanAmountCurrency) {
      total += total_loan.amount_kip;
    }
    setShowTotalLoan(total.toLocaleString("en-US"));
    return formatCurrency(total);
  };

  const totalPaymentLoan = () => {
    let total = 0;
    for (let total_loan of loanAmountPayment) {
      total += total_loan.amount_kip;
    }
    setShowTotalPaymentLoan(total.toLocaleString("en-US"));
    return formatCurrency(total);
  };

  const totalBalanceLoan = () => {
    let total = 0;
    for (let total_loan of loanAmountBalance) {
      total += total_loan.amount_kip;
    }
    setShowTotalBalanceLoan(total.toLocaleString("en-US"));
    return formatCurrency(total);
  };

  const footerGroup = (
    <ColumnGroup>
      <Row>
        <Column
        className="text-blue-500"
          footer="ລວມຈຳນວນໜີ້ກູ້ຢືມທັງໝົດ:"
          colSpan={3}
          footerStyle={{ textAlign: "right" }}
        />
        <Column  className="text-blue-500" footer={totalLoan} />
      </Row>
    </ColumnGroup>
  );

  const footerGroupPayment = (
    <ColumnGroup>
      <Row>
        <Column
         className="text-green-500"
          footer="ລວມຈຳນວນຊຳລະໜີ້ແລ້ວທັງໝົດ:"
          colSpan={3}
          footerStyle={{ textAlign: "right" }}
        />
        <Column  className="text-green-500" footer={totalPaymentLoan} />
      </Row>
    </ColumnGroup>
  );

  const footerGroupBalance = (
    <ColumnGroup>
      <Row>
        <Column
          className="text-red-500"
          footer="ລວມຈຳນວນໜີ້ຍັງເຫຼືອທັງໝົດ:"
          colSpan={3}
          footerStyle={{ textAlign: "right" }}
        />
        <Column   className="text-red-500" footer={totalBalanceLoan} />
      </Row>
    </ColumnGroup>
  );



  const toast = useRef(null);

  return (
    <div className="grid">

      <div className="col-12 lg:col-12 xl:col-12">
            <div className="card flex justify-content-center align-items-center text-blue-500 text-lg">       
       
          <label htmlFor="name" className="mr-3" >ປ່ຽນສະກຸນເງິນ</label>

          {/* <Dropdown  value={city} options={citySelectItems} onChange={(e) => setCity(e.value)} placeholder=""/> */}
         
          <Dropdown
                    value={city}
                    onChange={(e) => setCity(e.value)} 
                    options={loanAmountCurrency}
                    optionValue="currency"
                    optionLabel="currency"
                   
                  />
                
            </div>
        </div>
          
      <div className="col-12 lg:col-6 xl:col-4">
                  
        <div className="card mb-0">
          <div className="flex justify-content-between mb-3">
            <div>
              <span className="block text-500 font-medium mb-3">
                ຈຳນວນໜີ້ກູ້ຢືມທັງໝົດ
              </span>
              <div className="text-blue-600 font-medium text-xl">
                {showTotalLoan}
              </div>
            </div>
            <div
              className="flex align-items-center justify-content-center bg-blue-100 border-round"
              style={{ width: "2.5rem", height: "2.5rem" }}
            >
              Kip
            </div>
          </div>
        </div>
      </div>

      <div className="col-12 lg:col-6 xl:col-4">
        <div className="card mb-0">
          <div className="flex justify-content-between mb-3">
            <div>
              <span className="block text-500 font-medium mb-3">
                ຈຳນວນໜີ້ຊຳລະແລ້ວທັງໝົດ
              </span>
              <div className="text-900 font-medium text-xl text-green-600">
              {showTotalPaymentLoan}
              </div>
            </div>
            <div
              className="flex align-items-center justify-content-center bg-green-100 border-round"
              style={{ width: "2.5rem", height: "2.5rem" }}
            >
              Kip
            </div>
          </div>
        </div>
      </div>

      <div className="col-12 lg:col-6 xl:col-4">
        <div className="card mb-0">
          <div className="flex justify-content-between mb-3">
            <div>
              <span className="block text-500 font-medium mb-3">
                ຈຳນວນໜີ້ຍັງເຫຼືອທັງໝົດ
              </span>
              <div className="text-900 font-medium text-xl text-red-500">
              {showTotalBalanceLoan}
              </div>
            </div>
            <div
              className="flex align-items-center justify-content-center bg-red-100 border-round"
              style={{ width: "2.5rem", height: "2.5rem" }}
            >
              Kip
            </div>
          </div>
        </div>
      </div>

  
      <div className="col-12 xl:col-6">
        <div className="card">
        <h5>ສະຖິຕິ ການຊຳລະໜີ້ ແຕ່ປີ 2014 - ປະຈຸບັນ</h5>
             <Chart type="bar" data={chartbarPaymentData} options={chartbarPaymentOptions} /> 
        </div>
      </div>

      <div className="col-12 xl:col-6">
        <div className="card">
        <h5>ສະຖິຕິ ການກູ້ຢືມໜີ້ ແຕ່ປີ 2014 - ປະຈຸບັນ</h5>      
             <Chart type="bar" data={chartbarWithdrawData} options={chartbarWithdrawOptions} />
        </div>
      </div>

      <div className="col-12 xl:col-6">
    
    <div className="card ">
    <h5>ສະຖິຕິປະເພດໜີ້ກູ້ຢືມ</h5>
    <div className="flex justify-content-center"> 
    <Chart
        type="doughnut"
        data={chartData}
        options={chartOptions}
        className="w-full md:w-20rem"
      />
    </div>
     
    </div>
  </div>

  <div className="col-12 xl:col-6">
    
    <div className="card ">
    <h5>ສະຖິຕິ ກູ້ຢືມທະນາຄານ</h5>
   
    <Chart type="bar" data={chartData2} options={chartOptions2} />
 
     
    </div>
  </div>

      <div className="col-12 xl:col-12">
        <div className="card bg-blue-100">
        <h5>ລາຍລະອຽດຈຳນວນໜີ້ກູ້ຢືມທັງໝົດ</h5>
          <DataTable
            value={loanAmountCurrency}
            rows={10}
            paginator
            footerColumnGroup={footerGroup}
          >
            <Column
              field="currency"
              header="ຊື່ສະກຸນເງິນ"
              style={{ width: "25%" }}
            />
            <Column
              field="amount_currency"
              header="ຈຳນວນເງິນກູ້ຢຶມ"
              style={{ width: "25%" }}
              body={amountcurrencyBody}
            />
            <Column
              field="rate"
              header="ອັດຕາແລກປ່ຽນ"
              style={{ width: "25%" }}
              body={rateBody}
            />
            <Column
              field="amount_kip"
              header="ຈຳນວນເງິນ (ກີບ)"
              style={{ width: "40%" }}
              body={amountkipBody}
            />
          </DataTable>
        </div>

        <div className="card bg-green-100">
        <h5>ລາຍລະອຽດຈຳນວນຊຳລະໜີ້ແລ້ວທັງໝົດ</h5>
          <DataTable
            value={loanAmountPayment}
            rows={10}
            paginator
            footerColumnGroup={footerGroupPayment}
          
          >
            <Column
              field="currency"
              header="ຊື່ສະກຸນເງິນ"
              style={{ width: "25%" }}
            />
            <Column
              field="amount_currency_Payment"
              header="ຈຳນວນເງິນກູ້ຢຶມ"
              style={{ width: "25%" }}
              body={amountcurrencyPaymentBody}
            />
            <Column
              field="rate"
              header="ອັດຕາແລກປ່ຽນ"
              style={{ width: "25%" }}
              body={ratePaymentBody}
            />
            <Column
              field="amount_kip_Payment"
              header="ຈຳນວນເງິນ (ກີບ)"
              style={{ width: "40%" }}
              body={amountkipPaymentBody}
            />
          </DataTable>
        </div>

        <div className="card bg-red-100">
        <h5>ລາຍລະອຽດຈຳນວນໜີ້ຍັງເຫຼືອທັງໝົດ</h5>
          <DataTable
            value={loanAmountBalance}
            rows={10}
            paginator
            footerColumnGroup={footerGroupBalance}
          
          >
            <Column
              field="currency"
              header="ຊື່ສະກຸນເງິນ"
              style={{ width: "25%" }}
            />
            <Column
              field="amount_currency"
              header="ຈຳນວນເງິນກູ້ຢຶມ"
              style={{ width: "25%" }}
              body={amountcurrencyBalanceBody}
            />
            <Column
              field="rate"
              header="ອັດຕາແລກປ່ຽນ"
              style={{ width: "25%" }}
              body={rateBalanceBody}
            />
            <Column
              field="amount_kip"
              header="ຈຳນວນເງິນ (ກີບ)"
              style={{ width: "40%" }}
              body={amountkipBalancetBody}
            />
          </DataTable>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
