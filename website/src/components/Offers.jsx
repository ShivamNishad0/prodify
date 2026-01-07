import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


import pic1 from '../../../asset/img/1.png';
import pic2 from '../../../asset/img/2.png';
import pic3 from '../../../asset/img/3.png';
import pic4 from '../../../asset/img/4.png';

export { pic1, pic2, pic3, pic4 };
// Slider settings
const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
  arrows: false
};

function Offers() {
  return (
    <div>
      <div style={{ padding: "10px", paddingBottom: "20px", textAlign: "center" }}>
        <Slider {...sliderSettings} style={{ marginBottom: '2rem', borderRadius: '10px', overflow: 'hidden' }}>
          {[pic1, pic2, pic3, pic4].map((img, index) => (
            <div key={index}>
              <img src={img} alt={`Slide ${index + 1}`} style={{ width: '100%', height: '400px', objectFit: 'cover' }} />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}
export default Offers;
