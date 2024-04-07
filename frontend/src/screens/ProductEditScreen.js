import React, { useContext, useEffect, useReducer, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Store } from '../Store';
import { getError } from '../utils';
import ListGroup from 'react-bootstrap/ListGroup';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import Button from 'react-bootstrap/Button';
import Select from 'react-select';

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

const customStyles = {
  control: (provided) => ({
    ...provided,
    width: 300, // Set the width to your desired value
  }),
};

const ProductEditScreen = () => {
  const navigate = useNavigate();
  const params = useParams(); // /product/:id
  const { id: productId } = params;

  const { state } = useContext(Store);
  const { userInfo } = state;
  const [
    {
      loading,
      error,
      loadingUpdate,
      loadingUpload,
      errorUpload,
    },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    error: '',
  });

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [images, setImages] = useState([]);
  const [category, setCategory] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [countInStock, setCountInStock] = useState('');



  const [brand, setBrand] = useState('');
  const [newBrand, setNewBrand] = useState('');

  const [description, setDescription] = useState('');
  const [frameDimensions, setFrameDimensions] = useState('');
  const [newFrameDimensions, setNewFrameDimensions] = useState('');

  const [frameMaterial, setFrameMaterial] = useState('');
  const [newFrameMaterial, setNewFrameMaterial] = useState('');



  const [frameShape, setFrameShape] = useState('');
  const [newFrameShape, setNewFrameShape] = useState('');


  const [frameSize, setFrameSize] = useState('');

  const [frameStyle, setFrameStyle] = useState('');
  const [newFrameStyle, setNewFrameStyle] = useState('');


  const [frameTechnology, setFrameTechnology] = useState('');
  const [newFrameTechnology, setNewFrameTechnology] = useState('');

  const [frameType, setFrameType] = useState('');
  const [newFrameType, setNewFrameType] = useState('');

  const [frameWeight, setFrameWeight] = useState('');
  const [newFrameWeight, setNewFrameWeight] = useState('');

  const [frameWidth, setFrameWidth] = useState('');
  const [newFrameWidth, setNewFrameWidth] = useState('');

  const [modelNo, setModelNo] = useState('');
  const [newModelNo, setNewModelNo] = useState('');

  const [colors, setColors] = useState([]); // Add this line
  const [newColor, setNewColor] = useState('');

  const [weightGroup, setWeightGroup] = useState(''); // Add this line
  const [newWeightGroup, setNewWeightGroup] = useState('');



  const addColor = () => {
    if (newColor.trim() !== '' && !colors.includes(newColor.trim())) {
      setColors([...colors, newColor.trim()]);
      setNewColor('');
    }
  };

  const removeColor = (colorToRemove) => {
    setColors(colors.filter((color) => color !== colorToRemove));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/products/${productId}`);
        setName(data.name);
        setSlug(data.slug);
        setPrice(data.price);
        setImage(data.image);
        setImages(data.images);
        setCategory(data.category);
        setCountInStock(data.countInStock);
        setBrand(data.brand);

        setDescription(data.description);
        setColors(data.colors || []);
        setFrameMaterial(data.frameMaterial || '');
        setFrameStyle(data.frameStyle || '');
        setFrameTechnology(data.frameTechnology || '');
        setFrameType(data.frameType || '');
        setFrameShape(data.frameShape || '');
        setModelNo(data.modelNo || '');
        setFrameSize(data.frameSize || '');
        setFrameWidth(data.frameWidth || '');
        setFrameDimensions(data.frameDimensions || '');
        setFrameWeight(data.frameWeight || 0);
        setWeightGroup(data.weightGroup || '');

        dispatch({ type: 'FETCH_SUCCESS' });
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, [productId]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: 'UPDATE_REQUEST' });
      await axios.put(
        `/api/products/${productId}`,
        {
          _id: productId,
          name,
          slug,
          price,
          image,
          images,
          category: newCategory || category,
          brand: newBrand || brand,
          countInStock,
          description,
          colors,
          frameMaterial: newFrameMaterial || frameMaterial,
          frameStyle: newFrameStyle || frameStyle,
          frameTechnology: newFrameTechnology || frameTechnology,
          frameType: newFrameType || frameType,
          frameShape: newFrameShape || frameShape,
          modelNo: newModelNo || modelNo,
          frameSize,
          frameWidth,
          frameDimensions: newFrameDimensions || frameDimensions,
          frameWeight: newFrameWeight || frameWeight,
          weightGroup: newWeightGroup || weightGroup,
        }
        ,
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({
        type: 'UPDATE_SUCCESS',
      });
      toast.success('Product updated successfully');
      navigate('/admin/products');
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: 'UPDATE_FAIL' });
    }
  };

  const uploadFileHandler = async (e, forImages) => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append('file', file);
    try {
      dispatch({ type: 'UPLOAD_REQUEST' });
      const { data } = await axios.post('/api/upload', bodyFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          authorization: `Bearer ${userInfo.token}`,
        },
      });
      dispatch({ type: 'UPLOAD_SUCCESS' });

      if (forImages) {
        setImages([...images, data.secure_url]);
      } else {
        setImage(data.secure_url);
      }
      toast.success('Image uploaded successfully. Click Update to apply it');
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: 'UPLOAD_FAIL', payload: getError(err) });
    }
  };

  const deleteFileHandler = (fileName) => {
    setImages(images.filter((x) => x !== fileName));
    toast.success('Image removed successfully. Click Update to apply it');
  };

  const categoryOptions = [
    { value: 'eyeglasses', label: 'Eyeglasses' },
    { value: 'sunglasses', label: 'Sunglasses' },
    { value: 'contactLenses', label: 'Contact Lenses' },
    { value: 'readingGlasses', label: 'Reading Glasses' },
    { value: 'sportsGlasses', label: 'Sports Glasses' },
    { value: 'new', label: 'New Brand' },
  ];
  const brandOptions = [
    { value: 'tamilSight', label: 'TamilSight Optics' },
    { value: 'maduraiLens', label: 'MaduraiLens' },
    { value: 'kovaiGaze', label: 'KovaiGaze Optics' },
    { value: 'cholaView', label: 'CholaView Optics' },
    { value: 'marinaVision', label: 'MarinaVision' },
    { value: 'tamilNaduOptics', label: 'Tamil Nadu Optics' },
    { value: 'kaveriFocus', label: 'Kaveri Focus' },
    { value: 'aravalliView', label: 'AravalliView Optics' },
    { value: 'nilgiriGaze', label: 'NilgiriGaze Optics' },
    { value: 'tanjoreLens', label: 'TanjoreLens' },
    { value: 'kovilSight', label: 'KovilSight Optics' },
    { value: 'puducherryVision', label: 'PuducherryVision' },
    { value: 'thiruvalluvarOptics', label: 'Thiruvalluvar Optics' },
    { value: 'kumariFocus', label: 'Kumari Focus' },
    { value: 'new', label: 'New Brand' },
  ];
  const frameDimensionsOptions = [
    { value: '53-17-140', label: 'Standard Frame 1 (53-17-140)' },
    { value: '55-18-145', label: 'Compact Frame 2 (55-18-145)' },
    { value: '58-20-150', label: 'Large Frame 3 (58-20-150)' },
    { value: 'new', label: 'New Frame Dimension' },
];

const frameMaterialOptions = [
  { value: 'plastic', label: 'Plastic' },
  { value: 'metal', label: 'Metal' },
  { value: 'wood', label: 'Wood' },
  { value: 'acetate', label: 'Acetate' },
  // ... add more materials as needed
  { value: 'new', label: 'New Material' },
];


const frameShapeOptions = [
  { value: 'rectangle', label: 'Rectangle' },
  { value: 'round', label: 'Round' },
  { value: 'cat-eye', label: 'Cat Eye' },
  { value: 'aviator', label: 'Aviator' },
  // ... add more shapes as needed
  { value: 'new', label: 'New Shape' },
];


const frameTechnologyOptions = [
  { value: 'titanium', label: 'Titanium' },
  { value: 'memory-alloy', label: 'Memory Alloy' },
  { value: 'flexible-hinge', label: 'Flexible Hinge' },
  { value: 'polarized-lenses', label: 'Polarized Lenses' },
  // ... add more technologies as needed
  { value: 'new', label: 'New Technology' },
];

const frameTypeOptions = [
  { value: 'full-rim', label: 'Full Rim' },
  { value: 'semi-rimless', label: 'Semi-Rimless' },
  { value: 'rimless', label: 'Rimless' },
  { value: 'sports', label: 'Sports' },
  // ... add more types as needed
  { value: 'new', label: 'New Type' },
];


  const frameWeightOptions = [
    { value: 'light', label: 'Light' },
    { value: 'medium', label: 'Medium' },
    { value: 'heavy', label: 'Heavy' },
    // Add more options as needed
    { value: 'new', label: 'Enter New Frame Weight' },
  ];

 const modelNoOptions = [
    { value: 'JJ-E10235', label: 'JJ E10235' },
    { value: 'ABC-X56789', label: 'ABC X56789' },
    { value: 'XYZ-Y12345', label: 'XYZ Y12345' },
    { value: 'new', label: 'New Model' },
];

const frameWidthOptions = [
  { value: 'narrow', label: 'Narrow' },
  { value: 'average', label: 'Average' },
  { value: 'wide', label: 'Wide' },
  { value: 'extra-wide', label: 'Extra Wide' },
  // ... add more width options as needed
  { value: 'new', label: 'New Width' },
];

const frameStyleOptions = [
  { value: 'classic', label: 'Classic' },
  { value: 'vintage', label: 'Vintage' },
  { value: 'modern', label: 'Modern' },
  { value: 'retro', label: 'Retro' },
  // ... add more style options as needed
  { value: 'new', label: 'New Style' },
];



  return (
    <Container className="small-container">
      <Helmet>
        <title>Edit Product ${productId}</title>
      </Helmet>
      <h1>Edit Product {productId}</h1>

      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <Form onSubmit={submitHandler}>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control value={name} onChange={(e) => setName(e.target.value)} required />
          </Form.Group>

          <Form.Group className="mb-3" controlId="slug">
            <Form.Label>Slug</Form.Label>
            <Form.Control value={slug} onChange={(e) => setSlug(e.target.value)} required />
          </Form.Group>

          <Form.Group className="mb-3" controlId="price">
            <Form.Label>Price</Form.Label>
            <Form.Control value={price} onChange={(e) => setPrice(e.target.value)} required />
          </Form.Group>

          {/* <Form.Group className="mb-3" controlId="image">
            <Form.Label>Image File</Form.Label>
            <Form.Control value={image} onChange={(e) => setImage(e.target.value)} required />
          </Form.Group> */}

          <Form.Group className="mb-3" controlId="imageFile">
            <Form.Label>Upload Image</Form.Label>
            <Form.Control type="file" onChange={(e) => uploadFileHandler(e, false)} />
            {loadingUpload && <LoadingBox></LoadingBox>}
          </Form.Group>

          <Form.Group className="mb-3" controlId="additionalImage">
            <Form.Label>Additional Images</Form.Label>
            {images.length === 0 && <MessageBox>No image</MessageBox>}
            <ListGroup variant="flush">
              {images.map((x) => (
                <ListGroup.Item key={x}>
                  {x}
                  <Button variant="light" onClick={() => deleteFileHandler(x)}>
                    <i className="fa fa-times-circle"></i>
                  </Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Form.Group>

          <Form.Group className="mb-3" controlId="additionalImageFile">
            <Form.Label>Upload Additional Image</Form.Label>
            <Form.Control type="file" onChange={(e) => uploadFileHandler(e, true)} />
            {loadingUpload && <LoadingBox></LoadingBox>}
          </Form.Group>

          <Form.Group className="mb-3" controlId="category">
            <Form.Label>Category</Form.Label>
            <div className="d-flex"  >
              <Select
                styles={customStyles}
                value={categoryOptions.find((option) => option.value === category)}
                onChange={(selectedOption) => {
                  setCategory(selectedOption.value);
                  setNewCategory(''); // Clear the new category input when an existing category is selected
                }}
                options={categoryOptions}
                isSearchable
                placeholder={category ? category : "Select Category or Add New"}
              />
              {category === 'new' && (
                <Form.Control
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Enter New Category"
                />
              )}
            </div>
          </Form.Group>



          <Form.Group className="mb-3" controlId="brand">
            <Form.Label>Brand</Form.Label>
            <div className="d-flex">
              <Select
                value={brandOptions.find((option) => option.value === brand)}
                styles={customStyles}
                onChange={(selectedOption) => {
                  setBrand(selectedOption.value);
                  setNewBrand(''); // Clear the new brand input when an existing brand is selected
                }}
                options={brandOptions}
                isSearchable
                placeholder={brand ? brand : "Select Brand or Add New"}
              />
              {brand === 'new' && (
                <Form.Control
                  value={newBrand}
                  onChange={(e) => setNewBrand(e.target.value)}
                  placeholder="Enter New Brand"
                />
              )}
            </div>
          </Form.Group>



          <Form.Group className="mb-3" controlId="countInStock">
            <Form.Label>Count In Stock</Form.Label>
            <Form.Control value={countInStock} onChange={(e) => setCountInStock(e.target.value)} required />
          </Form.Group>

          <Form.Group className="mb-3" controlId="description">
            <Form.Label>Description</Form.Label>
            <Form.Control value={description} onChange={(e) => setDescription(e.target.value)} required />
          </Form.Group>

          <Form.Group className="mb-3" controlId="frameDimensions">
            <Form.Label>Frame Dimensions</Form.Label>
            <div className="d-flex">
              <Select
                styles={customStyles}
                value={frameDimensionsOptions.find((option) => option.value === frameDimensions)}
                onChange={(selectedOption) => {
                  setFrameDimensions(selectedOption.value);
                  setNewFrameDimensions(''); // Clear the new frame dimension input when an existing frame dimension is selected
                }}
                options={frameDimensionsOptions}
                isSearchable
                placeholder={frameDimensions ? frameDimensions : "Select Frame Dimension"}
              />
              {frameDimensions === 'new' && (
                <Form.Control
                  value={newFrameDimensions}
                  onChange={(e) => setNewFrameDimensions(e.target.value)}
                  placeholder="Enter New Frame Dimension"
                />
              )}
            </div>
          </Form.Group>


          <Form.Group className="mb-3" controlId="frameMaterial">
            <Form.Label>Frame Material</Form.Label>
            <div className="d-flex">
              <Select
                styles={customStyles}
                value={frameMaterialOptions.find((option) => option.value === frameMaterial)}
                onChange={(selectedOption) => {
                  setFrameMaterial(selectedOption.value);
                  setNewFrameMaterial(''); // Clear the new frame material input when an existing frame material is selected
                }}
                options={frameMaterialOptions}
                isSearchable
                placeholder={frameMaterial ? frameMaterial : "Enter New Frame Material"}
              />
              {frameMaterial === 'new' && (
                <Form.Control
                  value={newFrameMaterial}
                  onChange={(e) => setNewFrameMaterial(e.target.value)}

                />
              )}
            </div>
          </Form.Group>


          <Form.Group className="mb-3" controlId="frameShape">
            <Form.Label>Frame Shape</Form.Label>
            <div className="d-flex">
              <Select
                styles={customStyles}
                value={frameShapeOptions.find((option) => option.value === frameShape)}
                onChange={(selectedOption) => {
                  setFrameShape(selectedOption.value);
                  setNewFrameShape(''); // Clear the new frame shape input when an existing frame shape is selected
                }}
                options={frameShapeOptions}
                isSearchable
                placeholder={frameShape ? frameShape : "Select Frame Shape or Add New"}
              />
              {frameShape === 'new' && (
                <Form.Control
                  value={newFrameShape}
                  onChange={(e) => setNewFrameShape(e.target.value)}
                  placeholder="Enter New Frame Shape"
                />
              )}
            </div>
          </Form.Group>


          <Form.Group className="mb-3" controlId="frameSize">
            <Form.Label>Frame Size</Form.Label>
            <Form.Control value={frameSize} onChange={(e) => setFrameSize(e.target.value)} required />
          </Form.Group>

          <Form.Group className="mb-3" controlId="frameStyle">
            <Form.Label>Frame Style</Form.Label>
            <div className="d-flex">
              <Select
                styles={customStyles}
                value={frameStyleOptions.find((option) => option.value === frameStyle)}
                onChange={(selectedOption) => {
                  setFrameStyle(selectedOption.value);
                  setNewFrameStyle(''); // Clear the new frame style input when an existing frame style is selected
                }}
                options={frameStyleOptions}
                isSearchable
                placeholder={frameStyle ? frameStyle : "Enter New Frame Style"}
              />
              {frameStyle === 'new' && (
                <Form.Control
                  value={newFrameStyle}
                  onChange={(e) => setNewFrameStyle(e.target.value)}
                />
              )}
            </div>
          </Form.Group>


          <Form.Group className="mb-3" controlId="frameTechnology">
            <Form.Label>Frame Technology</Form.Label>
            <div className="d-flex">
              <Select
                styles={customStyles}
                value={frameTechnologyOptions.find((option) => option.value === frameTechnology)}
                onChange={(selectedOption) => {
                  setFrameTechnology(selectedOption.value);
                  setNewFrameTechnology(''); // Clear the new frame technology input when an existing frame technology is selected
                }}
                options={frameTechnologyOptions}
                isSearchable
                placeholder={frameTechnology ? frameTechnology : "Enter New Frame Technology"}
              />
              {frameTechnology === 'new' && (
                <Form.Control
                  value={newFrameTechnology}
                  onChange={(e) => setNewFrameTechnology(e.target.value)}
                />
              )}
            </div>
          </Form.Group>


          <Form.Group className="mb-3" controlId="frameType">
            <Form.Label>Frame Type</Form.Label>
            <div className="d-flex">
              <Select
                styles={customStyles}
                value={frameTypeOptions.find((option) => option.value === frameType)}
                onChange={(selectedOption) => {
                  setFrameType(selectedOption.value);
                  setNewFrameType(''); // Clear the new frame type input when an existing frame type is selected
                }}
                options={frameTypeOptions}
                isSearchable
                placeholder={frameType ? frameType : "Enter New Frame Type"}
              />
              {frameType === 'new' && (
                <Form.Control
                  value={newFrameType}
                  onChange={(e) => setNewFrameType(e.target.value)}
                />
              )}
            </div>
          </Form.Group>

          <Form.Group className="mb-3" controlId="frameWeight">
            <Form.Label>Frame Weight</Form.Label>
            <div className="d-flex">
              <Select
                styles={customStyles}
                value={frameWeightOptions.find((option) => option.value === frameWeight)}
                onChange={(selectedOption) => {
                  const selectedValue = selectedOption ? selectedOption.value : '';
                  setFrameWeight(selectedValue);
                  setNewFrameWeight(''); // Clear the new frame weight input when an existing frame weight is selected
                }}
                options={frameWeightOptions}
                isSearchable
              />
              {frameWeight === 'new' && (
                <Form.Control

                  value={newFrameWeight}
                  onChange={(e) => setNewFrameWeight(e.target.value)}
                />
              )}
            </div>
          </Form.Group>

          <Form.Group className="mb-3" controlId="frameWidth">
            <Form.Label>Frame Width</Form.Label>
            <div className="d-flex">
              <Select
                styles={customStyles}
                value={frameWidthOptions.find((option) => option.value === frameWidth)}
                onChange={(selectedOption) => {
                  setFrameWidth(selectedOption.value);
                  setNewFrameWidth(''); // Clear the new frame width input when an existing frame width is selected
                }}
                options={frameWidthOptions}
                isSearchable
                placeholder={frameWidth ? frameWidth : "Enter New Frame Width"}
              />
              {frameWidth === 'new' && (
                <Form.Control
                  value={newFrameWidth}
                  onChange={(e) => setNewFrameWidth(e.target.value)}
                />
              )}
            </div>
          </Form.Group>



          <Form.Group className="mb-3" controlId="modelNo">
            <Form.Label>Model No</Form.Label>
            <div className="d-flex">
              <Select
                styles={customStyles}
                value={modelNoOptions.find((option) => option.value === modelNo)}
                onChange={(selectedOption) => {
                  setModelNo(selectedOption.value);
                  setNewModelNo(''); // Clear the new model no input when an existing model no is selected
                }}
                options={modelNoOptions}
                isSearchable
                placeholder={modelNo ? modelNo : "Enter New Model No"}
              />
              {modelNo === 'new' && (
                <Form.Control
                  value={newModelNo}
                  onChange={(e) => setNewModelNo(e.target.value)}
                />
              )}
            </div>
          </Form.Group>


          {/* ... (similar form fields for other properties) */}

          <Form.Group className="mb-3" controlId="colors">
            <Form.Label>Colors</Form.Label>
            <div>
              {colors.map((color, index) => (
                <span key={index} className="badge bg-secondary me-2">
                  {color}
                  <button
                    type="button"
                    className="btn-close btn-sm"
                    onClick={() => removeColor(color)}
                    aria-label="Remove color"
                  ></button>
                </span>
              ))}
            </div>
            <div className="d-flex mt-2">
              <Form.Control
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
                placeholder="Enter Color"
                className="me-2"
              />
              <Button variant="primary" onClick={addColor}>
                Add Color
              </Button>
            </div>
            <small className="text-muted">Separate multiple colors with commas (e.g., Red, Blue, Green)</small>
          </Form.Group>

          <div className="mb-3">
            <Button disabled={loadingUpdate} type="submit">
              Update
            </Button>
            {loadingUpdate && <LoadingBox></LoadingBox>}
          </div>
        </Form>
      )}
    </Container>
  );

}


export default ProductEditScreen;