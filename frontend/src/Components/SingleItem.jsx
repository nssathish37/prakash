import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@chakra-ui/react";
import { ContextProvider } from "../Context/Context";
import { SERVER_URL } from "../App";
import Loading from "./Loading";

const SingleItem = () => {
	const { _id } = useParams();
	const [singleProduct, setSingleProduct] = useState(null);
	const [singleImage, setSingleImage] = useState("");
	const { token } = useContext(ContextProvider);

	const getSingleItem = async () => {
		try {
			const res = await axios.get(`${SERVER_URL}/product/${_id}`);
			setSingleProduct(res.data.product);
			localStorage.setItem("category", res.data.product.category);
			console.log(res.data.product.category);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		if (singleProduct && singleProduct.product_image.length > 0) {
			setSingleImage(singleProduct.product_image[0]);
		}
	}, [singleProduct]);

	useEffect(() => {
		getSingleItem();
	}, [_id]);

	const addToCart = async () => {
		try {
			const res = await axios.post(
				"https://croma-server.onrender.com/add-to-cart",
				{
					productId: _id,
					quantity: 1
				},
				{
					headers: {
						Authorization: `Bearer ${token}`
					}
				}
			);
			if (res.data.success) {
				alert("Product added to cart");
			} else {
				alert("Failed to add to cart");
			}
		} catch (error) {
			console.error("Error adding product to cart:", error.response ? error.response.data : error.message);
			alert("An error occurred. Please try again.");
		}
	};


	const {
		product_title = "",
		price = 0,
		product_description = "",
		product_image = [],
		banner_image = [],
		product_color = "",
		rating = 0,
		reviews = 0,
		brand = "",
	} = singleProduct || {};

	if (!singleProduct) {
		return <div className="container h-96 w-auto flex justify-center items-center"><Loading text={"Loading..."} /></div>;
	}

	return (
		<div className="container py-4">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div className="flex flex-col gap-16">
					<div className="flex gap-4">
						<div className="flex gap-4 flex-col">
							{product_image.map((e, index) => (
								<button
									key={index}
									className="border border-gray-50 hover:border-green-700 rounded-sm hover:border-2 p-1"
									onClick={() => setSingleImage(e)}
								>
									<img className="w-20 h-20" src={e} alt={`Thumbnail ${index}`} />
								</button>
							))}
						</div>
						<div className="ml-8">
							<img src={singleImage} className="w-80" alt="product_image" />
						</div>
					</div>
					<div className="w-full flex gap-8">
						<Button w={"full"} colorScheme="green">Buy Now</Button>
						<Button w={"full"} colorScheme="grey" borderWidth={"1px"} onClick={addToCart}>Add To Cart</Button>
					</div>
				</div>
				<div className="flex flex-col gap-4">
					<h1 className="text-xl font-bold">{product_title}</h1>
					<p className="text-green-500 text-sm font-semibold">{rating} <span>&#9733;</span>&nbsp;
						<span className="underline">({rating} Rating & {reviews} Reviews)</span></p>
					<div>
						<h1 className="text-2xl font-extrabold">{price.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</h1>
						<p className="text-xs">(Inclusive of all taxes)</p>
					</div>
					<div>
						<h3 className="w-full border-b-2">Super Saving (2 OFFERS)</h3>
						<div className="flex flex-col gap-4 my-4 text-xs">
							<p>Buy & Get Rs.500 off (Discount auto applied in cart)</p>
							<p>Buy Select Croma LED & Get Croma Bluetooth Home Theatre @ Rs.4499/-</p>
						</div>
						<div>
							<img className="w-full" src="https://media-ik.croma.com/prod/https://media.croma.com/image/upload/v1723097584/Croma%20Assets/CMS/LP%20Page%20Banners/2024/Independence%20Day%20Sale/PDP_ZipCare_8Aug2024_zwujhs.png" alt="offer_banner" />
						</div>
					</div>
					<div className="flex gap-8">
						<Button w={"fit-content"} bg={'none'} textColor={"white"} borderWidth={2}>{brand}</Button>
						<Button w={"fit-content"} bg={'none'} textColor={"white"} borderWidth={2}>{product_color}</Button>
					</div>
					<div className="border border-gray-300 p-4 rounded-md">
						<span className="font-semibold">Key Feauters: </span><br />
						<p className="text-sm mt-2">{product_description}</p>
					</div>
				</div>
			</div>
			<div className="border-2 my-8 p-2 rounded-lg">
				<h1 className="text-xl font-bold my-4 w-full border-b-2">Product Overview</h1>
				{
					banner_image.map((e, index) => {
						return (
							<div key={index}>
								<img className="w-full" src={e} alt="" />
							</div>
						)
					})
				}
			</div>
		</div>
	);
};

export default SingleItem;
