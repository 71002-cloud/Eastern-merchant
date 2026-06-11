import logoImg from '../assets/logo.png';

export default function Header() {
    return (
        <header>
            <img src={logoImg} alt="Logo" className="logo" />
            <h1>Eastern Merchant</h1>
        </header>
    )
}