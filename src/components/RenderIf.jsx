export default function RenderIf({ when, children }) {
  return when ? children : null;
}