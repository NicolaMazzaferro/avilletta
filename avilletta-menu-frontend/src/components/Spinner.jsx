import spinner from '../assets/spinner-pizza.gif';

export default function Spinner() {

    return (
        <>
            
                <div className="flex flex-col justify-center items-center">
                    <img className="" src={spinner} alt="Loading..." />
                </div>
           
        </>
    );
}
