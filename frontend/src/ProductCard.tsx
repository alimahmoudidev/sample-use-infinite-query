// ProductCard component for rendering individual product details
interface Product {
    id: number;
    name: string;
    price: number;
    description: string;
}

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    return (
        <div className="bg-white shadow-lg rounded-lg p-4 hover:shadow-xl transition-shadow duration-300 min-h-[500px]">
            <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
            <p className="text-gray-600 mb-2">${product.price.toFixed(2)}</p>
            <p className="text-gray-500 line-clamp-3">{product.description}</p>
        </div>
    );
};

export default ProductCard;