import { StateField, StateEffect } from '@codemirror/state'
import { Decoration, WidgetType, EditorView } from '@codemirror/view'

class RemoteCursorWidget extends WidgetType {
  constructor(color, username) {
    super()
    this.color = color
    this.username = username
  }

  toDOM() {
    const span = document.createElement('span')
    span.className = 'cm-remote-cursor'
    span.style.cssText = `border-left:2px solid ${this.color};margin-left:-1px;height:1em;display:inline;pointer-events:none`
    span.title = this.username
    return span
  }
}

export const setRemoteCursors = StateEffect.define()

export const remoteCursorsField = StateField.define({
  create: () => Decoration.none,
  update(cursors, tr) {
    let result = cursors.map(tr.changes)
    for (const effect of tr.effects) {
      if (effect.is(setRemoteCursors)) {
        const list = effect.value
        result = Decoration.set(
          list.map(({ pos, color, username }) =>
            Decoration.widget({
              widget: new RemoteCursorWidget(color, username),
              side: 0,
            }).range(pos)
          ),
          true
        )
      }
    }
    return result
  },
  provide: (f) => EditorView.decorations.from(f),
})
