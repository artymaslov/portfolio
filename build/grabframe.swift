import AVFoundation
import AppKit

// grabframe <video> <seconds> <out.png>
let a = CommandLine.arguments
guard a.count == 4, let t = Double(a[2]) else { exit(2) }
let asset = AVURLAsset(url: URL(fileURLWithPath: a[1]))
let gen = AVAssetImageGenerator(asset: asset)
gen.appliesPreferredTrackTransform = true
gen.requestedTimeToleranceBefore = .zero
gen.requestedTimeToleranceAfter = .zero
do {
    let cg = try gen.copyCGImage(at: CMTime(seconds: t, preferredTimescale: 600), actualTime: nil)
    let rep = NSBitmapImageRep(cgImage: cg)
    guard let data = rep.representation(using: .png, properties: [:]) else { exit(3) }
    try data.write(to: URL(fileURLWithPath: a[3]))
    print("\(cg.width)x\(cg.height)")
} catch { print("ERR \(error)"); exit(1) }
