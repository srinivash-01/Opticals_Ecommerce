import axios from 'axios';
import { useContext, useEffect, useReducer, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';

import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Rating from '../components/Rating';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { getError } from '../utils';
import { Store } from '../Store';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { toast } from 'react-toastify';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

const reducer = (state, action) => {
  switch (action.type) {
    case 'REFRESH_PRODUCT':
      return { ...state, product: action.payload };
    case 'CREATE_REQUEST':
      return { ...state, loadingCreateReview: true };
    case 'CREATE_SUCCESS':
      return { ...state, loadingCreateReview: false };
    case 'CREATE_FAIL':
      return { ...state, loadingCreateReview: false };
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, product: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function ProductScreen() {
  let reviewsRef = useRef();
  const lensPackages = [
    { value: 'package1', label: 'Package 1' },
    { value: 'package2', label: 'Package 2' },
    // Add more options as needed
  ];

  const prescriptionTypes = [
    { value: 'type1', label: 'Type 1' },
    { value: 'type2', label: 'Type 2' },
    // Add more options as needed
  ];

  const coatings = [
    { value: 'coating1', label: 'Coating 1' },
    { value: 'coating2', label: 'Coating 2' },
    // Add more options as needed
  ];

  const lensTypes = [
    { value: 'type1', label: 'Type 1' },
    { value: 'type2', label: 'Type 2' },
    // Add more options as needed
  ];
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedLensPackage, setSelectedLensPackage] = useState('');
  const [selectedPrescriptionType, setSelectedPrescriptionType] = useState('');
  const [selectedCoating, setSelectedCoating] = useState('');
  const [selectedLensType, setSelectedLensType] = useState('');
  const [leftLensPower, setLeftLensPower] = useState('');
  const [rightLensPower, setRightLensPower] = useState('');
  const [selectLens, setSelectLens] = useState(false);

  const navigate = useNavigate();
  const params = useParams();
  const { slug } = params;

  const [{ loading, error, product, loadingCreateReview }, dispatch] =
    useReducer(reducer, {
      product: [],
      loading: true,
      error: '',
    });
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get(`https://opticals-ecommerce.vercel.app/api/products/slug/${slug}`);
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchData();
  }, [slug]);

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;
  const addToCartHandler = async () => {
    const existItem = cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      window.alert('Sorry. Product is out of stock');
      return;
    }
    // Create a temporary product with selected lens details
    const temporaryProduct = {
      ...product,
      lensPackages: [selectedLensPackage],
      prescriptionType: selectedPrescriptionType,
      coatings: [selectedCoating],
      lensType: [selectedLensType],
      lensPower: {
        left: leftLensPower,
        right: rightLensPower,
      },
      quantity,
    };
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: temporaryProduct,
    });
    navigate('/cart');
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!comment || !rating) {
      toast.error('Please enter comment and rating');
      return;
    }
    try {
      const { data } = await axios.post(
        `/api/products/${product._id}/reviews`,
        { rating, comment, name: userInfo.name },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );

      dispatch({
        type: 'CREATE_SUCCESS',
      });
      toast.success('Review submitted successfully');
      product.reviews.unshift(data.review);
      product.numReviews = data.numReviews;
      product.rating = data.rating;
      dispatch({ type: 'REFRESH_PRODUCT', payload: product });
      window.scrollTo({
        behavior: 'smooth',
        top: reviewsRef.current.offsetTop,
      });
    } catch (error) {
      toast.error(getError(error));
      dispatch({ type: 'CREATE_FAIL' });
    }
  };
  return loading ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div>
      <Row>
        <Col md={6}>
          <Carousel
            additionalTransfrom={0}
            arrows
            autoPlay
            autoPlaySpeed={3000}
            centerMode={false}
            className=""
            containerClass="container-with-dots"
            dotListClass=""
            draggable
            focusOnSelect={false}
            infinite
            itemClass=""
            keyBoardControl
            minimumTouchDrag={80}
            renderButtonGroupOutside
            renderDotsOutside={false}
            responsive={{
              desktop: {
                breakpoint: { max: 3000, min: 1024 },
                items: 1,
                partialVisibilityGutter: 40,
              },
              tablet: {
                breakpoint: { max: 1024, min: 464 },
                items: 1,
                partialVisibilityGutter: 30,
              },
              mobile: {
                breakpoint: { max: 464, min: 0 },
                items: 1,
                partialVisibilityGutter: 30,
              },
            }}
            showDots={false}
            sliderClass=""
            slidesToSlide={1}
            swipeable
          >
            {[product.image, ...product.images].map((x, index) => (
              <img
                key={index}
                className="img-large"
                src={x}
                alt={`product-${index}`}
              />
            ))}
          </Carousel>
        </Col>
        {!selectLens ?
          <Col md={6}>
            <Card>
              <Card.Body>
                <Helmet>
                  <title>{product.name}</title>
                </Helmet>
                <Card.Title >{product.name}</Card.Title>
                <Rating
                  rating={product.rating}
                  numReviews={product.numReviews}
                ></Rating>

                <Row>
                  <Col md={3}>Pirce:</Col>
                  <Col>₹{product.price}</Col>
                </Row>
                <Row>
                  <Col md={3}>Status:</Col>
                  <Col>
                    {product.countInStock > 0 ? (
                      <Badge bg="success" >In Stock</Badge>
                    ) : (
                      <Badge bg="danger" >Unavailable</Badge>
                    )}
                  </Col>
                </Row>
                <Row>
                  <Col md={3}>Shape:</Col>
                  <Col>{product.frameShape}</Col>
                </Row>
                <Row>
                  <Col md={3}>Material:</Col>
                  <Col>{product.frameMaterial}</Col>
                </Row>
                <Row>
                  <Col md={3}>frameSize:</Col>
                  <Col>{product.frameSize}</Col>
                </Row>
                <Row>
                  <Col md={3}>Style:</Col>
                  <Col>{product.frameStyle}</Col>
                </Row>
                <Row>
                  <Col md={3}>Technology:</Col>
                  <Col>{product.frameTechnology}</Col>
                </Row>
                <Row>
                  <Col md={3}>Type:</Col>
                  <Col>{product.frameType}</Col>
                </Row>
                <Row>
                  <Col md={3}>Weight:</Col>
                  <Col>{product.frameWeight}</Col>
                </Row>
                <Row>
                  <Col md={3}>Width:</Col>
                  <Col>{product.frameWidth}</Col>
                </Row><Row>
                  <Col md={3}>modelNo:</Col>
                  <Col>{product.modelNo}</Col>
                </Row>
                <Row>
                  <Col md={3}>Description:</Col>
                  <Col style={{ textAlign: "justify" }}>{product.description}</Col>
                </Row>
                <Button
                  onClick={() => {
                    setSelectLens(!selectLens);
                  }}
                  variant="dark"
                  style={{ width: "-webkit-fill-available", marginTop: "1rem" }}
                >
                  Select the Lens
                </Button>
              </Card.Body>
            </Card>
          </Col>
          :

          <Col md={6}>

            <Card>
              <Card.Header style={{ display: "flex", justifyContent: "flex-end" }}>
                <Button onClick={() => { setSelectLens(!selectLens) }} variant="dark">
                  Back
                </Button>
              </Card.Header>
              <Card.Body>
                <ListGroup variant="flush">

                  <Col md={6} lg={10} style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end"
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-evenly", paddingBottom: "2%" }}>
                      <label htmlFor="lensPackage" style={{ marginRight: "10px" }}>Lens Package:</label>
                      <select
                        id="lensPackage"
                        value={selectedLensPackage}
                        onChange={(e) => setSelectedLensPackage(e.target.value)}
                      >
                        <option value="">Select Lens Package</option>
                        {lensPackages.map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-evenly", paddingBottom: "2%" }}>
                      <label htmlFor="prescriptionType" style={{ marginRight: "10px" }}>Prescription Type:</label>
                      <select
                        id="prescriptionType"
                        value={selectedPrescriptionType}
                        onChange={(e) => setSelectedPrescriptionType(e.target.value)}
                      >
                        <option value="">Select Prescription Type</option>
                        {prescriptionTypes.map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-around", paddingBottom: "2%" }}>
                      <label htmlFor="coating" style={{ marginRight: "10px" }}>Coating:</label>
                      <select
                        id="coating"
                        value={selectedCoating}
                        onChange={(e) => setSelectedCoating(e.target.value)}
                      >
                        <option value="">Select Coating</option>
                        {coatings.map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-around", paddingBottom: "2%" }}>
                      <label htmlFor="lensType" style={{ marginRight: "10px" }}>Lens Type:</label>
                      <select
                        id="lensType"
                        value={selectedLensType}
                        onChange={(e) => setSelectedLensType(e.target.value)}
                      >
                        <option value="">Select Lens Type</option>
                        {lensTypes.map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-around", paddingBottom: "2%" }}>
                      <label htmlFor="leftLensPower" style={{ marginRight: "10px" }}>Left Lens Power:</label>
                      <input
                        type="text"
                        id="leftLensPower"
                        value={leftLensPower}
                        onChange={(e) => setLeftLensPower(e.target.value)}
                      />
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-around", paddingBottom: "2%" }}>
                      <label htmlFor="rightLensPower" style={{ marginRight: "10px" }}>Right Lens Power:</label>
                      <input
                        type="text"
                        id="rightLensPower"
                        value={rightLensPower}
                        onChange={(e) => setRightLensPower(e.target.value)}
                      />
                    </div>
                  </Col>


                  {product.countInStock > 0 ?
                    <ListGroup.Item>
                      <div className="d-grid">
                        <Button onClick={addToCartHandler} variant="dark">
                          Add to Cart
                        </Button>
                      </div>
                    </ListGroup.Item>
                    : <ListGroup.Item>
                      <div className="d-grid">
                        <Button onClick={addToCartHandler} variant="primary" disabled={true}>
                          Out Of Stock
                        </Button>

                      </div></ListGroup.Item>}
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        }
      </Row>
      <div className="my-3">
        <h2 ref={reviewsRef}>Reviews</h2>
        <div className="mb-3">
          {product.reviews.length === 0 && (
            <MessageBox>There is no review</MessageBox>
          )}
        </div>
        <ListGroup>
          {product.reviews.map((review) => (
            <ListGroup.Item key={review._id}>
              <strong>{review.name}</strong>
              <Rating rating={review.rating} caption=" "></Rating>
              <p>{review.createdAt.substring(0, 10)}</p>
              <p>{review.comment}</p>
            </ListGroup.Item>
          ))}
        </ListGroup>
        <div className="my-3">
          {userInfo ? (
            <form onSubmit={submitHandler}>
              <h2>Write a customer review</h2>
              <Form.Group className="mb-3" controlId="rating">
                <Form.Label>Rating</Form.Label>
                <Form.Select
                  aria-label="Rating"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                >
                  <option value="">Select...</option>
                  <option value="1">1- Poor</option>
                  <option value="2">2- Fair</option>
                  <option value="3">3- Good</option>
                  <option value="4">4- Very good</option>
                  <option value="5">5- Excelent</option>
                </Form.Select>
              </Form.Group>
              <FloatingLabel
                controlId="floatingTextarea"
                label="Comments"
                className="mb-3"
              >
                <Form.Control
                  as="textarea"
                  placeholder="Leave a comment here"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </FloatingLabel>

              <div className="mb-3">
                <Button disabled={loadingCreateReview} variant="dark">
                  Submit
                </Button>
                {loadingCreateReview && <LoadingBox></LoadingBox>}
              </div>
            </form>
          ) : (
            <MessageBox>
              Please{' '}
              <Link to={`/signin?redirect=/product/${product.slug}`}>
                Sign In
              </Link>{' '}
              to write a review
            </MessageBox>
          )}
        </div>
      </div>
    </div>
  );
}
export default ProductScreen;
