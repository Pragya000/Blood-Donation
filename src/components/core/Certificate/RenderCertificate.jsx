/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useRef } from "react";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Logo from "../../../assets/logo.png";
import sign from "../../../assets/signature.png";
import BackgroundImage from '../../../assets/certificate.png';
import moment from 'moment';

export default function RenderCertificate({ certificate, userName }) {

    const certificateRef = useRef();

    const generatePDF = () => {
        const input = certificateRef.current;
        html2canvas(input).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('landscape', 'pt', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`${userName}-certificate.pdf`);
        });
    };

    return (
        <>
        <div style={{
                maxWidth: '100%',
                maxHeight: '80vh',
                overflow: 'auto',
                padding: '20px',
                border: '1px solid #ccc',
                borderRadius: '10px',
            }}>
            <div ref={certificateRef} style={{
                width: '800px', aspectRatio: '7/5',
                backgroundColor: '#fff',
                backgroundImage: `url(${BackgroundImage})`, backgroundRepeat: 'no-repeat', backgroundPosition: 'center', backgroundSize: 'contain',
                padding: '60px'
            }}>
                <div style={{
                    width: '100%',
                    height: '100%',
                    border: '1px solid transparent',
                    position: 'relative'
                }}>
                    <p style={{
                        textAlign: 'center',
                        marginTop: '180px',
                        marginBottom: '20px'
                    }}>This Certificate is presented to <b>{userName}</b> for {certificate?.reason === 'Donation' ? 'Donating Blood' : 'Participating in Blood Donation Camp'}</p>
                    <img src={Logo} alt="Company Logo" style={{ height: '50px', margin: '0 auto' }} />
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '12px',
                        marginTop: '20px'
                    }}>
                        <p><b>Date:</b> {
                            moment(certificate?.createdAt).format('DD-MM-YYYY')
                        }</p>
                        <p><b>Certificate ID:</b> {certificate?.cert_id}</p>
                        <div style={{ marginTop: '12px' }}>
                            <img src={sign} alt="Signature" style={{ height: '50px', margin: '0 auto' }} />
                            <p>Authorized Signatory</p>
                        </div>
                    </div>
                    <div style={{
                        fontSize: '10px',
                        position: 'absolute',
                        bottom: '0',
                        left: '0',
                    }}>
                        <p><b>Link:</b> <a style={{
                            color: '#00f',
                            textDecoration: 'underline'

                        }} href={`https://bloodconnectmain.vercel.app/verify/${certificate?.cert_id}`}>{`https://bloodconnectmain.vercel.app/verify/${certificate?.cert_id}`}</a></p>
                    </div>
                </div>
            </div>
            </div>
            <button className="mr-2 p-2 bg-green-500 text-white rounded mt-4" onClick={generatePDF}>
                Download Certificate
            </button>
            <a target="_blank" rel="noopener noreferrer" href={`https://bloodconnectmain.vercel.app/verify/${certificate?.cert_id}`} >
            <button className="mr-2 p-2 bg-blue-500 text-white rounded mt-4">
                Link
            </button>
            </a>
        </>
    )
}