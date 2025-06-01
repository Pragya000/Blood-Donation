import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import PropTypes from 'prop-types'

export default function MyImage({src, alt, className}) {
    return (
        <LazyLoadImage
        alt={alt}
        effect='blur'
        src={src}
        className={className}
    />
    )
}

MyImage.propTypes = {
    src: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
    className: PropTypes.string,
}