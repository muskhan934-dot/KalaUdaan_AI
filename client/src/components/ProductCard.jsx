import { motion } from "framer-motion";
import { Heart, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function ProductCard({p}){
  return <motion.article className="product-card" whileHover={{y:-8, rotateX:1.5}}>
    <div className="product-image-wrap">
      <img src={p.image} alt={p.name}/>
      <button className="heart"><Heart size={17}/></button>
      <span className="verified">✓ Verified</span>
    </div>
    <div className="product-info">
      <div className="eyebrow">{p.craft} · {p.region}</div>
      <h3>{p.name}</h3>
      <div className="product-bottom">
        <strong>₹{p.price.toLocaleString()}</strong>
        <span>★ {p.rating}</span>
      </div>
      <Link className="text-link" to={`/product/${p.id}`}>View product <ArrowUpRight size={16}/></Link>
    </div>
  </motion.article>
}
