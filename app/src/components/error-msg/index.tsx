import Logo from '/logo.svg';

type Props = {
  msg?: string;
};
export const ErrorMsg = ({ msg = 'Something wrong' }: Props) => {
  return (
    <div className="flex-1 flex flex-col justify-center items-center">
      <img src={Logo} className="w-8 h-8 mb-4" alt="MyDash logo" />
      <p>{msg}</p>
    </div>
  );
};
