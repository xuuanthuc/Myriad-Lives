export default function AssetIcon({file}) {
  const url=`${import.meta.env.BASE_URL}assets/svg/${file}`;
  return <span className="asset-icon" aria-hidden="true" style={{maskImage:`url("${url}")`,WebkitMaskImage:`url("${url}")`}}/>;
}
