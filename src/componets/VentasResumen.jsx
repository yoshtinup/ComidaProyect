const VentasResumen = ({ title, ingresos = "$12,500", ventas = "3,200" }) => (
  <>
    <div className="w-full px-4 pt-5 pb-3">
      <div className="text-neutral-900 text-xl font-bold leading-7">
        {title}
      </div>
    </div>

    <div className="w-full px-4">
      <div className="rounded-xl outline outline-1 outline-offset-[-1px] outline-zinc-300 overflow-hidden">
        {/* Para escritorio (tabla) */}
        <div className="hidden sm:block">
          <table className="min-w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left p-6 text-neutral-900 text-base font-medium leading-normal border-b border-zinc-300">Ingresos Totales</th>
                <th className="text-left p-6 text-neutral-900 text-base font-medium leading-normal border-b border-zinc-300">Número de Ventas</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="text-left p-6 text-2xl font-bold">{ingresos}</td>
                <td className="text-left p-6 text-2xl font-bold">{ventas}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Para móviles (stack) */}
        <div className="sm:hidden p-4 flex flex-col gap-4">
          <div>
            <div className="text-sm text-neutral-900 font-medium">Ingresos Totales</div>
            <div className="text-2xl font-bold">{ingresos}</div>
          </div>
          <div>
            <div className="text-sm text-neutral-900 font-medium">Número de Ventas</div>
            <div className="text-2xl font-bold">{ventas}</div>
          </div>
        </div>
      </div>
    </div>
  </>
);

export default VentasResumen;
