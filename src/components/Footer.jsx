import RunButton from './RunButton'
import CompileButton from './CompileButton'
import LeaveButton from './LeaveButton'

function Footer() {
  return (
    <footer className="shrink-0 px-6 py-3 bg-slate-900 border-t border-slate-700 w-full">
      <div className="flex items-center justify-end gap-6">
        <RunButton />
        <CompileButton />
        <LeaveButton />
      </div>
    </footer>
  )
}

export default Footer