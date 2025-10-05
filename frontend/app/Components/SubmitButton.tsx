type SubmitButtonProps = {
  text: string;
  disabled?: boolean;
  extraClassName?: string;
  onClick?: () => void | Promise<void>;
};

export default function SubmitButton({
  text,
  disabled,
  extraClassName,
  onClick
}: SubmitButtonProps) {
  const buttonBaseClassName = "font-medium rounded-md outline-none transition duration-300 border-none text-white ";

  return (
    <button
      className={
        disabled ?
          buttonBaseClassName + "cursor-not-allowed opacity-60 " + extraClassName :
          buttonBaseClassName + "cursor-pointer " + extraClassName
      }
      disabled={disabled}
      onClick={onClick}
    >
      {text}
    </button>
  );
};
