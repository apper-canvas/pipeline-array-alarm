import { useEffect } from 'react';

const ResetPassword = () => {
    useEffect(() => {
        const { ApperUI } = window.ApperSDK;
        ApperUI.showResetPassword('#authentication-reset-password');
    }, []);

    return (
        <div className="flex-1 py-12 px-5 flex justify-center items-center">
            <div id="authentication-reset-password" className="bg-white mx-auto w-[400px] max-w-full p-10 rounded-2xl shadow-lg"></div>
        </div>
    );
};

export default ResetPassword;