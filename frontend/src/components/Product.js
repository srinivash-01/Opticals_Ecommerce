import React, { useEffect, useState, useContext, useReducer } from 'react';
import Card from 'react-bootstrap/Card';
import { toast } from 'react-toastify';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import Rating from './Rating';
import axios from 'axios';
import { Store } from '../Store';
import { getError } from '../utils';


function Product(props) {


  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [images, setImages] = useState([]);
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState('');
  const [brand, setBrand] = useState('');
  const [description, setDescription] = useState('');


  const { product } = props;
  const [productData, setProductData] = useState(null);
  if (productData) {
    console.log(productData.countInStock)
  }
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;



  ////////////////////

  const { userInfo } = state;

  const reducer = (state, action) => {
    switch (action.type) {
      case 'FETCH_REQUEST':
        return { ...state, loading: true };
      case 'FETCH_SUCCESS':
        return { ...state, loading: false };
      case 'FETCH_FAIL':
        return { ...state, loading: false, error: action.payload };
      case 'UPDATE_REQUEST':
        return { ...state, loadingUpdate: true };
      case 'UPDATE_SUCCESS':
        return { ...state, loadingUpdate: false };
      case 'UPDATE_FAIL':
        return { ...state, loadingUpdate: false };
      case 'UPLOAD_REQUEST':
        return { ...state, loadingUpload: true, errorUpload: '' };
      case 'UPLOAD_SUCCESS':
        return {
          ...state,
          loadingUpload: false,
          errorUpload: '',
        };
      case 'UPLOAD_FAIL':
        return { ...state, loadingUpload: false, errorUpload: action.payload };

      default:
        return state;
    }
  };

  const [{ loading, error, loadingUpdate, loadingUpload }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: '',
    });
  //////////

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const { data } = await axios.get(`https://opticals-ecommerce.vercel.app/api/products/${product._id}`);
        setName(data.name);
        setSlug(data.slug);
        setPrice(data.price);
        setImage(data.image);
        setImages(data.images);
        setCategory(data.category);
        setCountInStock(data.countInStock);
        setBrand(data.brand);
        setDescription(data.description);
        setProductData(data);
      } catch (error) {
        console.error('Error fetching product data:', error);
      }
    };

    fetchProductData();
  }, [product._id]);

  // const addToCartHandler = async () => {
  //   try {
  //     if (!productData) {
  //       return; // Product data not available yet
  //     }

  //     const existItem = cartItems.find((x) => x._id === productData._id);
  //     const quantity = existItem ? existItem.quantity + 1 : 1;

  //     if (productData.countInStock < quantity) {
  //       window.alert('Sorry. Product is out of stock');
  //       return;
  //     }
  //     //////////////////////////////////////////////





  //     try {
  //       console.log("UPDATE_REQUEST");
  //       var updatedCountInStock = productData.countInStock - 1;
  //       if(updatedCountInStock<0){
  //         updatedCountInStock = 0;
  //       }
  //       console.log({
  //         _id: productData._id,
  //         name,
  //         slug,
  //         price,
  //         image,
  //         images,
  //         category,
  //         brand,
  //         countInStock:updatedCountInStock,
  //         description,
  //       });
  //       dispatch({ type: 'UPDATE_REQUEST' });
  //       await axios.put(
  //         `/api/products/${productData._id}`,
  //         {
  //           _id: productData._id,
  //           name,
  //           slug,
  //           price,
  //           image,
  //           images,
  //           category,
  //           brand,
  //           countInStock:updatedCountInStock,
  //           description,
  //         },
  //         {
  //           headers: { Authorization: `Bearer ${userInfo.token}` },
  //         }
  //       );
  //       dispatch({
  //         type: 'UPDATE_SUCCESS',
  //       });
        
  //     } catch (err) {
  //       toast.error(getError(err));
  //       dispatch({ type: 'UPDATE_FAIL' });
  //     }


  //     ////////////////////////////////////////////////

  //     // Assuming your server sends a success message

  //     ctxDispatch({
  //       type: 'CART_ADD_ITEM',
  //       payload: { ...productData, quantity },
  //     });

  //     toast.success('Added to Cart');

  //   } catch (error) {
  //     console.error('Error adding item to cart:', error.message);
  //   }
  // };
  


  return (
    <Card style={{ background: '#ffff', width: "90%",height: "100%"}}>
      <Link to={`/product/${product.slug}`}>
        <img src={product.image} className="card-img-top" alt={product.name} />
      
      <Card.Body>
        
          <Card.Title style={{ color: 'black', textDecoration: 'none' }}>
            {product.name}
          </Card.Title>
        
        <Rating rating={product.rating} numReviews={product.numReviews} />
        <Card.Text>₹{product.price}</Card.Text>

        {productData && productData.countInStock === 0 ? (
          <Button variant="light" disabled>
            Out of stock
          </Button>
        ) : (
          <></>
        )}
      </Card.Body>
      </Link>
    </Card>
  );
}

export default Product;
