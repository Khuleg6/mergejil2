import { Spinner } from '../Spinner';

type AuthButtonProps = {
  activeBtn: 'Нэвтрэх' | 'Эхлэх' | null;
  setActiveBtn?: (value: 'Нэвтрэх' | 'Эхлэх') => void;
  user: boolean;
  loading: boolean;
};
export const AuthButton = ({
  activeBtn,
  setActiveBtn,
  user,
  loading,
}: AuthButtonProps) => {
  return (
    <div>
      {loading ? (
        <div>
          <Spinner />
        </div>
      ) : user ? (
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setActiveBtn?.('Эхлэх')}
            className={`text-[14px] font-semibold py-1.5 px-4 flex justify-center items-center ${activeBtn === 'Эхлэх' ? 'bg-[#F59e0b] rounded-lg text-[#1b3a6b] hover:opacity-90 transition-all duration-150' : 'bg-#FBBF24 border border-[#64748b] rounded-lg text-[#64748b] hover:opacity-90 transition-all duration-150'}`}
          >
            Эхлэх
          </button>
        </div>
      ) : (
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setActiveBtn?.('Нэвтрэх')}
            className={`text-[14px] font-semibold py-1.5 px-4 flex justify-center items-center ${activeBtn === 'Нэвтрэх' ? 'bg-[#F59e0b] rounded-lg text-[#1b3a6b] hover:opacity-90 transition-all duration-150' : 'bg-black border border-[#64748b] rounded-lg text-[#64748b] hover:opacity-90 transition-all duration-150'}`}
          >
            Нэвтрэх
          </button>
          <button
            onClick={() => setActiveBtn?.('Эхлэх')}
            className={`text-[14px] font-semibold py-1.5 px-4 flex justify-center items-center ${activeBtn === 'Эхлэх' ? 'bg-[#F59e0b] rounded-lg text-[#1b3a6b] hover:opacity-90 transition-all duration-150' : 'bg-black border border-[#64748b] rounded-lg text-[#64748b] hover:opacity-90 transition-all duration-150'}`}
          >
            Эхлэх
          </button>
        </div>
      )}
    </div>
  );
};
