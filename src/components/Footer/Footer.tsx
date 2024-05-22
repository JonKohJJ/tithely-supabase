import './Footer_Style.css'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <section className="footer-section flex justify-center py-[50px] mt-auto">
      <div className="mycontainer flex justify-center items-center gap-1">
        <p className="fs-caption">&copy; {new Date().getFullYear()} Tithely All Rights Reserved</p>
        <p className="fs-base">∙</p>
        <Link to='/tithely-supabase/style-guide' className="fs-caption">Style Guide</Link>
      </div>
    </section>
  )
}

export default Footer
