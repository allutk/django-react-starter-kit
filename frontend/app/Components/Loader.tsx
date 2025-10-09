import * as LoaderClass from "react-spinners";

export default function Loader({ isLoading = true }: { isLoading?: boolean }) {
  return (
    <div className="fixed z-1 top-1/2 left-1/2 -translate-1/2">
      <LoaderClass.ClipLoader size={35} color={"#123abc"} loading={isLoading} />
    </div>
  );
}
