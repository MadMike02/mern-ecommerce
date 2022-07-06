import React, { useEffect } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Table, Button, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { listAllOrder } from "../actions/orderAction";
import { ORDER_LIST_ALL_RESET } from "../constants/orderConstants";

function OrderListAllScreen() {
    var i =1;

  const dispatch = useDispatch();
  const orderListAll = useSelector((state) => state.orderListAll);
  const { loading, error, orders } = orderListAll;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const navigate = useNavigate();

  useEffect(() => {
    dispatch({ type: ORDER_LIST_ALL_RESET });

    if (!userInfo.isAdmin) {
      navigate("/login");
    } else {
      dispatch(listAllOrder());
    }
  }, [userInfo,dispatch,navigate]);


  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h1>Orders</h1>
        </Col>
      </Row>
      
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Table striped bordered responsive className="table-sm">
          <thead>
            <tr>
            <th>s.no</th>
              <th>ID</th>
              <th>User</th>
              <th>Date</th>
              <th>Price</th>
              <th>paymentMethod</th>
              <th>isPaid</th>
              <th>Delivered</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{i++}</td>
                <td>{order._id}</td>
                <td>{order.user.name}</td>
                <td>{order.createdAt.substring(0,10)}</td>
                <td>${order.totalPrice}</td>
                <td>{order.paymentMethod}</td>
                <td>{order.isPaid ? (order.paidAt.substring(0,10)): (<i className='fas fa-times' style={{color:'red'}}></i>)}</td>
                <td>{order.isDelivered ? (order.deliveredAt.substring(0,10)): (<i className='fas fa-times' style={{color:'red'}}></i>)}</td>
                <td>
                  <LinkContainer to={`/order/${order._id}`}>
                    <Button variant="light" className="btn-sm">
                      Details
                    </Button>
                  </LinkContainer>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
}

export default OrderListAllScreen;
