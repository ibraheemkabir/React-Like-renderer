import htmlSnapshotSerializer from 'jest-serializer-html'
import { expect } from 'vitest'

expect.addSnapshotSerializer(htmlSnapshotSerializer)
