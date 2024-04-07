import React, { useContext, useEffect, useReducer } from 'react';
import Chart from 'react-google-charts';
import axios from 'axios';
import { Store } from '../Store';
import { getError } from '../utils';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        summary: action.payload,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function DashboardScreen() {
  const [{ loading, summary, error }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });
  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get('https://opticals-ecommerce.vercel.app/api/orders/summary', {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, [userInfo]);

  return (
    <div>
      <h1>Dashboard</h1>
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          <Row>
            <Col md={4}>
              <Card className="bg-primary text-white">
                <Card.Body>
                  <Card.Title>{summary.users[0].numUsers}</Card.Title>
                  <Card.Text>Total Users</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="bg-success text-white">
                <Card.Body>
                  <Card.Title>{summary.orders[0].numOrders}</Card.Title>
                  <Card.Text>Total Orders</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="bg-info text-white">
                <Card.Body>
                  <Card.Title>₹{summary.orders[0].totalSales.toFixed(2)}</Card.Title>
                  <Card.Text>Total Sales</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <div className="my-3">
            <h2>Sales</h2>
            {summary.dailyOrders.length === 0 ? (
              <MessageBox>No Sale</MessageBox>
            ) : (
              <Chart
                width="100%"
                height="400px"
                chartType="LineChart"
                loader={<div>Loading Chart...</div>}
                data={[
                  ['Date', 'Sales', { role: 'annotation' }],
                  ...summary.dailyOrders.map((x) => [new Date(x._id), x.sales, x.sales.toString()]),
                ]}
                options={{
                  chart: {
                    title: 'Sales',
                    subtitle: 'Sales per day',
                  },
                  legend: 'none',
                  hAxis: {
                    title: 'Date',
                  },
                  vAxis: {
                    title: 'Sales',
                  },
                  colors: ['#3366cc'], // Specify color for the line
                }}
              />
            )}
          </div>
          <div className="my-3">
            <h2>Product Categories</h2>
            {summary.productCategories.length === 0 ? (
              <MessageBox>No Category</MessageBox>
            ) : (
              <Chart
                width="100%"
                height="400px"
                chartType="PieChart"
                loader={<div>Loading Chart...</div>}
                data={[
                  ['Category', 'Products'],
                  ...summary.productCategories.map((x) => [x._id, x.count]),
                ]}
                options={{
                  title: 'Product Categories',
                }}
              />
            )}
          </div>
        </>
      )}
      <style>{`
        .card {
          margin-bottom: 20px;
          border-radius: 10px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .card-title {
          font-size: 2rem;
          font-weight: bold;
        }
        .card-text {
          font-size: 1.2rem;
        }
      `}</style>
    </div>
  );
}
