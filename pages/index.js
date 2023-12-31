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

const Dashboard = () => {
  const [products, setProducts] = useState(null);
  const [lineOptions, setLineOptions] = useState(null);
  const { layoutConfig } = useContext(LayoutContext);
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [loanAmountCurrency, setLoanAmountCurrency] = useState([]);
  const [loanAmountPayment, setLoanAmountPayment] = useState([]);
  const [loanAmountBalance, setLoanAmountBalance] = useState([]);
  const [showTotalLoan, setShowTotalLoan] = useState(null);
  const [showTotalPaymentLoan, setShowTotalPaymentLoan] = useState(null);
  const [showTotalBalanceLoan, setShowTotalBalanceLoan] = useState(null);

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

  const lineData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Augt",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "ຍອດຊຳລະໜີ້",
        data: [65, 59, 80, 81, 56, 55, 40, 80, 81, 56, 55, 40],
        fill: false,
        backgroundColor: "#d90404",
        borderColor: "#d90404",
        tension: 0.4,
      },
      {
        label: "ໜີ້ຈະຕ້ອງຈ່າຍ",
        data: [28, 48, 40, 19, 86, 27, 90, 80, 81, 56, 55, 40],
        fill: false,
        backgroundColor: "#4979F8",
        borderColor: "#4979F8",
        tension: 0.4,
      },
    ],
  };

  const applyLightTheme = () => {
    const lineOptions = {
      plugins: {
        legend: {
          labels: {
            color: "#495057",
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: "#495057",
          },
          grid: {
            color: "#ebedef",
          },
        },
        y: {
          ticks: {
            color: "#495057",
          },
          grid: {
            color: "#ebedef",
          },
        },
      },
    };

    setLineOptions(lineOptions);
  };

  const applyDarkTheme = () => {
    const lineOptions = {
      plugins: {
        legend: {
          labels: {
            color: "#ebedef",
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: "#ebedef",
          },
          grid: {
            color: "rgba(160, 167, 181, .3)",
          },
        },
        y: {
          ticks: {
            color: "#ebedef",
          },
          grid: {
            color: "rgba(160, 167, 181, .3)",
          },
        },
      },
    };

    setLineOptions(lineOptions);
  };

  useEffect(() => {
    ProductService.getProductsSmall().then((data) => setProducts(data));
  }, []);

  useEffect(() => {
    const documentStyle = getComputedStyle(document.documentElement);
    const data = {
      labels: ["ໜີ້ກູ້ຢືມໂດຍກົງ", "ໜີ້ກູ້ຢືມຕໍ່", "ໜີ້ກູ້ຢືມແກ້ສະພາບຄ່ອງ"],
      datasets: [
        {
          data: [300, 300, 300],
          backgroundColor: [
            documentStyle.getPropertyValue("--red-600"),
            documentStyle.getPropertyValue("--orange-600"),
            documentStyle.getPropertyValue("--yellow-600"),
          ],
          hoverBackgroundColor: [
            documentStyle.getPropertyValue("--red-400"),
            documentStyle.getPropertyValue("--orange-400"),
            documentStyle.getPropertyValue("--yellow-400"),
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
    if (layoutConfig.colorScheme === "light") {
      applyLightTheme();
    } else {
      applyDarkTheme();
    }
  }, [layoutConfig.colorScheme]);

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
      <Toast ref={toast} />
      {/* <div className="col-12 lg:col-6 xl:col-3">
       
            <div className="card mb-0">
                <div className="flex justify-content-between mb-3">
                    <div>
                        <span className="block text-500 font-medium mb-3">ໜີ້ກູ້ຢືມໂດຍກົງທັງໝົດ</span>
                        <div className="text-900 font-medium text-xl">2.450.000.000.000</div>
                    </div>
                    <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                      Kip 
                    </div>
                </div>
            </div>
        </div> */}
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
          <h5>ສະແດງຍອດໜີ້ໃນແຕ່ລະເດືອນ</h5>
          <Chart type="line" data={lineData} options={lineOptions} />
        </div>
      </div>

      <div className="col-12 xl:col-6">
        <div className="card flex justify-content-center">
          <Chart
            type="doughnut"
            data={chartData}
            options={chartOptions}
            className="w-full md:w-20rem"
          />
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
