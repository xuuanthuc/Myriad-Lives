/** Reuse the supplied SVGs without changing their original files. */
export default function ArrowIcon({direction='right'}) {
  const file=direction==='down'?'angles-down-solid-full.svg':'angles-up-solid-full.svg';
  const url=`${import.meta.env.BASE_URL}assets/svg/${file}`;
  return <span className="arrow-icon" data-direction={direction} aria-hidden="true" style={{maskImage:`url("${url}")`,WebkitMaskImage:`url("${url}")`}}/>;
}
