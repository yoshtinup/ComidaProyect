function Footer() {
  return (
    <div className="w-full px-5 py-8 bg-white mt-8">
      <div className="w-full max-w-[960px] mx-auto px-5 py-1">
        <div className="flex flex-col sm:flex-row sm:justify-between flex-wrap gap-4 mb-6 text-center sm:text-left">
          <div className="text-neutral-500 text-sm sm:text-base">Preguntas frecuentes</div>
          <div className="text-neutral-500 text-sm sm:text-base">Términos y condiciones</div>
          <div className="text-neutral-500 text-sm sm:text-base">Política de privacidad</div>
        </div>
        <div className="text-center text-neutral-500 text-sm sm:text-base">
          © 2025 CineSnacks. Todos los derechos reservados.
        </div>
      </div>
    </div>
  );
}

export default Footer;
