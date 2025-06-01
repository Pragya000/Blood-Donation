/* eslint-disable react/prop-types */
export default function Chip({bgColor='bg-gray-800', text}) {
    return (
        <div className={`${bgColor} text-white font-bold text-xs tracking-wide max-w-max rounded-full p-1 px-2`}>
            {text}
        </div>
    )
}