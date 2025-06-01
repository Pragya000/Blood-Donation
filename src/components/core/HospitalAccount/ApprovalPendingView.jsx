import { Player } from '@lottiefiles/react-lottie-player';
import PendingLottieFile from '../../../data/lottie/Pending.json'
import HospitalDetails from './HospitalDetails';
import { useUser } from '../../../store/useUser';

export default function HospitalApprovalPendingView() {
    const {user} = useUser()
    return (
        <>
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-84px)]">
                <Player
                    autoplay
                    keepLastFrame
                    src={PendingLottieFile}
                    style={{ height: '250px', width: '250px' }}
                />
                <div>
                <h3 className='font-semibold text-lg max-w-xl mx-auto text-center'>
                    Your account is under review. You will be notified once your account is approved.
                </h3>
                <HospitalDetails user={user} />
                </div>
            </div>
        </>
    )
}