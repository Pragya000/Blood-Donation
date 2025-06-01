import { Player } from '@lottiefiles/react-lottie-player';
import RejectedLottieFile from '../../../data/lottie/Rejection.json'
import HospitalDetails from './HospitalDetails';
import { useUser } from '../../../store/useUser';

export default function HospitalRejectedView() {
    const {user} = useUser()
    return (
        <>
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-84px)]">
                <Player
                    autoplay
                    keepLastFrame
                    src={RejectedLottieFile}
                    style={{ height: '250px', width: '250px' }}
                />
                <div>
                <h3 className='font-semibold text-lg max-w-xl mx-auto text-center'>
                    Your account has been rejected. Please contact support for more details.
                </h3>
                <HospitalDetails user={user} />
                </div>
            </div>
        </>
    )
}