import style from '../css/banner.css'
import logo from '../img/logo.jpg'

function Banner() {

  return (
    <div className='Banner'>
      <div className='title'> ElectroAnalyzer </div>
      <img className='logo' src={logo} alt='Logo de la compañia' />
    </div>
    
  );
}

export default Banner;